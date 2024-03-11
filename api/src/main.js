
import { fetchEmbeddingModel } from './models.js'
import { redis } from './redis.js'

import { BIGFOOT_PREFIX, BIGFOOT_STREAM } from './config.js'


export async function save(sighting) {

  // set the basic information in Redis
  const key = sightingKey(sighting.id)
  await redis.hSet(key, sighting)

  // if there is observed text...
  if (sighting.observed) {

    // ...dump the text into the summarization queue
    const { id, observed } = sighting
    await redis.xAdd(BIGFOOT_STREAM, '*', { id, observed })

    // ...and respond that you did
    return `Added sighting ${sighting.id} to backlog for summarization.`

  }

  // if there is no observed text, respond that you saved the sighting without a summary
  return `Added sighting ${sighting.id} to store without summary.`

}

export async function search(query, params, count) {

  // build a search query portion of the redis query based on the parameters
  let searchQuery = ''
  if (params.state) searchQuery += `@state:{${params.state}} `
  if (params.county) searchQuery += `@county:{${params.county}} `
  if (params.classification) searchQuery += `@classification:{${params.classification}} `
  if (params.highTemp) searchQuery += `@highTemp:[${params.highTemp[0]} ${params.highTemp[1]}] `
  if (params.point) searchQuery += `@latlng:[${params.point.lng} ${params.point.lat} ${params.point.radius} mi] `

  // if the search query portion is empty, default it to a wildcard
  if (searchQuery.length === 0) searchQuery = "*"

  // build the vector query portion of the redis query
  const vectorQuery = `KNN ${count} @embedding $BLOB`

  // put it all together in the format (*)=>[KNN 1 @embedding $BLOB]
  const redisQuery = `(${searchQuery})=>[${vectorQuery}]`

  // embed the query string entered by the user
  const embedding = await fetchEmbeddingModel().embedQuery(query)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)

  // execute the search
  const searchResults = await redis.ft.search('bigfoot:sighting:index', redisQuery, {
    DIALECT: 2,
    PARAMS: { 'BLOB': embeddingBytes },
    SORTBY: '__embedding_score',
    RETURN: [ 'id', 'title', 'summary', '__embedding_score' ]
  })

  // parse and return the results
  const results =  searchResults.documents.map(document => document.value)
  return results

}

export async function fetch(id) {

  // fetch the sighting from Redis
  const key = sightingKey(id)
  const sighting = await redis.hGetAll(key)

  // don't return the embedding
  delete sighting.embedding

  // return the sighting
  return sighting

}

function sightingKey(id) {
  return `${BIGFOOT_PREFIX}:${id}`
}
