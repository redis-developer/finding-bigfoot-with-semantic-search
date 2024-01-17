import { LlamaCpp } from '@langchain/community/llms/llama_cpp'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'
import { RedisVectorStore } from '@langchain/community/vectorstores/redis'

import { createClient } from 'redis'

// create the embedding model
const embeddingModel = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2'
})

// connect to redis
const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()

// create an instance of the vector store
const vectorStore = new RedisVectorStore(embeddingModel, {
  redisClient: redis,
  indexName: "bigfoot:sighting:index",
  keyPrefix: "bigfoot:sighting:",
})

export async function embedAndSave(sighting) {

  // const instructionTemplate = `
  //   You are a helpful assistant who summarize accounts of Bigfoot sightings. These
  //   summaries will be used to generate embeddings for the sightings so that they can be
  //   searched using vector search. You will be given an account of a Bigfoot sighting and
  //   you will summarize it using no more than 512 words. You will ONLY return the summary,
  //   and nothing more. You will NEVER return more than 512 words.`

  // const sightingTemplate = "{sighting}"

  // const chatPrompt = ChatPromptTemplate.fromMessages([
  //   ["system", instructionTemplate],
  //   ["system", sightingTemplate]
  // ])

  // const summarizationModel = new LlamaCpp({
  //   modelPath: "./models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
  // })

  // const summary = await chatPrompt.pipe(summarizationModel).invoke({
  //   sighting: sighting.observed
  // })

  await vectorStore.addDocuments([{
    metadata: sighting,
    pageContent: sighting.observed
  }])

  return `Added sighting ${sighting.id} added to vector store`
}

export async function queryRedis(text) {
  const result = await vectorStore.similaritySearch(text, 1)
  return result
}
