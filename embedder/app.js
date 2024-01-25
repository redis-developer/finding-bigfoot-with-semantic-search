import { ChatPromptTemplate } from '@langchain/core/prompts'

const instructionTemplate = `
  You are a helpful assistant who summarize accounts of Bigfoot sightings. These
  summaries will be used to generate embeddings for the sightings so that they can be
  searched using vector search. You will be given an account of a Bigfoot sighting and
  you will summarize it using no more than 512 words. You will ONLY return the summary,
  and nothing more. You will NEVER return more than 512 words.`

const sightingTemplate = "{sighting}"


async function saveEmbedding(id, text) {

  const key = `bigfoot:sighting:${id}`

  const summary = await summarize(text)
  const embeddingBytes = await embed(summary)

  await redis.hSet(key, { summary, embedding: embeddingBytes })
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

console.log("Hello, world!")
