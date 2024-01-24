import { ChatPromptTemplate } from '@langchain/core/prompts'

import { fetchEmbeddingModel, fetchSummarizationModel } from './models.js'
import { redis } from './redis.js'


const instructionTemplate = `
  You are a helpful assistant who summarize accounts of Bigfoot sightings. These
  summaries will be used to generate embeddings for the sightings so that they can be
  searched using vector search. You will be given an account of a Bigfoot sighting and
  you will summarize it using no more than 512 words. You will ONLY return the summary,
  and nothing more. You will NEVER return more than 512 words.`

const sightingTemplate = "{sighting}"

// TODO: have this dump to a stream instead and process it asynchronously
export async function save(sighting) {

  // set the basic information in Redis
  const key = `bigfoot:sighting:${sighting.id}`
  await redis.hSet(key, sighting)

  // if there is observed text...
  if (sighting.observed) {

    // ...summarize and embed it
    const summary = await summarize(sighting.observed)
    const embeddingBytes = await embed(summary)

    // ...save it to Redis
    redis.hSet(key, 'summary', summary)
    await redis.hSet(key, 'embedding', embeddingBytes)

    // ...and return the results
    return `Added sighting ${sighting.id} to vector store using summary:\n${summary}`
  }

  return `Added sighting ${sighting.id} to store without summary.`
}

export async function search(query, count) {

  const embedding = await embeddingModel.embedQuery(query)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)
  const redisQuery = `*=>[KNN ${count} @embedding $BLOB]`

  // TODO: add sorting by vector score
  const searchResults = await redis.ft.search('bigfoot:sighting:index', redisQuery, {
    DIALECT: 2,
    PARAMS: { 'BLOB': embeddingBytes },
    RETURN: [ 'id', 'title', 'observed', 'classification', 'county', 'state' ]
  })

  const results =  searchResults.documents.map(document => document.value)

  return results
}

async function summarize(text) {
  try {
    return await tryToSummarize(fetchSummarizationModel(), text)
  } catch (error) {
    console.log("Error using model. Recreating model and retrying.", error)
    return await innerSummarize(fetchSummarizationModel(true), text)
  }
}

async function tryToSummarize(model, text) {
  return await ChatPromptTemplate
    .fromMessages([
      ["system", instructionTemplate],
      ["system", sightingTemplate] ])
    .pipe(model)
    .invoke({ sighting: text })
}

async function embed(text) {
  const embedding = await fetchEmbeddingModel().embedQuery(text)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)
  return embeddingBytes
}