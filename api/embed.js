import { ChatPromptTemplate } from '@langchain/core/prompts'

import { embeddingModel, summarizationModel } from './models.js'
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

  // TODO: this is a hack to get around a bug in the summarization model
  // NOTE: could try destroying and recreating the model here

  let tryCount = 0

  while (true) {
    try {
      const summary = await ChatPromptTemplate
        .fromMessages([
          ["system", instructionTemplate],
          ["system", sightingTemplate] ])
        .pipe(summarizationModel)
        .invoke({ sighting: text })
      return summary
    } catch (error) {
      console.log(error)
      if (tryCount < 2) {
        console.log("Retrying")
        tryCount++
        continue
      } else {
        throw error
      }
    }
  }
}

async function embed(text) {
  const embedding = await embeddingModel.embedQuery(text)
  const embeddingBytes = Buffer.from(Float32Array.from(embedding).buffer)
  return embeddingBytes
}