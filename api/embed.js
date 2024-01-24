
import { fetchEmbeddingModel } from './models.js'
import { redis } from './redis.js'


export async function save(sighting) {

  // set the basic information in Redis
  const key = `bigfoot:sighting:${sighting.id}`
  await redis.hSet(key, sighting)

  // if there is observed text...
  if (sighting.observed) {

    // ...dump the text into the summarization queue
    const { id, observed } = sighting
    await redis.xAdd('bigfoot:sighting:reported', '*', { id, observed })

    // ...and log that you did
    return `Added sighting ${sighting.id} to backlog for summarization.`
  }

  return `Added sighting ${sighting.id} to store without summary.`
}

export async function search(query, params, count) {

  let searchQuery = ''
  if (params.state) searchQuery += `@state:{${params.state}} `
  if (params.county) searchQuery += `@county:{${params.county}} `
  if (params.classification) searchQuery += `@classification:{${params.classification}} `
  if (params.highTemp) searchQuery += `@highTemp:[${params.highTemp[0]} ${params.highTemp[1]}] `
  if (params.point) searchQuery += `@latlng:[${params.point.lng} ${params.point.lat} ${params.point.radius} mi] `

  if (searchQuery.length === 0) searchQuery = "*"

  const vectorQuery = `KNN ${count} @embedding $BLOB`
  const redisQuery = `(${searchQuery})=>[${vectorQuery}]`

  const embedding = await fetchEmbeddingModel().embedQuery(query)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)

  const searchResults = await redis.ft.search('bigfoot:sighting:index', redisQuery, {
    DIALECT: 2,
    PARAMS: { 'BLOB': embeddingBytes },
    SORTBY: '__embedding_score',
    RETURN: [ 'id', 'title', 'observed', 'classification', 'county', 'state', 'latitude', 'longitude', 'highTemp' ]
  })

  const results =  searchResults.documents.map(document => document.value)

  return results
}
