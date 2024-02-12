
import { fetchEmbeddingModel } from './models.js'
import { redis, BIGFOOT_PREFIX, BIGFOOT_INDEX, BIGFOOT_STREAM } from './redis.js'


export async function save(sighting) {

  // set the basic information in Redis
  const key = `${BIGFOOT_PREFIX}:${sighting.id}`
  await redis.hSet(key, sighting)

  // if there is observed text...
  if (sighting.observed) {

    // ...dump the text into the summarization queue
    const { id, observed } = sighting
    await redis.xAdd(BIGFOOT_STREAM, '*', { id, observed })

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
  if (params.minTemp) searchQuery += `@highTemp:[${params.minTemp} ${params.maxTemp}] `
  if (params.point) searchQuery += `@latlng:[${params.point.lng} ${params.point.lat} ${params.point.radius} mi] `

  if (searchQuery.length === 0) searchQuery = "*"

  const vectorQuery = `KNN ${count} @embedding $BLOB`
  const redisQuery = `(${searchQuery})=>[${vectorQuery}]`

  const embedding = await fetchEmbeddingModel().embedQuery(query)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)

  const searchResults = await redis.ft.search(BIGFOOT_INDEX, redisQuery, {
		DIALECT: 2,
		PARAMS: { BLOB: embeddingBytes },
		SORTBY: '__embedding_score',
		RETURN: ['id', 'title', 'observed', 'summary', 'classification', 'county', 'state', 'latitude', 'longitude', 'highTemp', '__embedding_score'],
	})

  const results =  searchResults.documents.map(document => document.value)

  return results
}
