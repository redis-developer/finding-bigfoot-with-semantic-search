import { LlamaCpp } from '@langchain/community/llms/llama_cpp'
import { ChatPromptTemplate } from '@langchain/core/prompts'

export async function embedAndSave(sighting) {

  const instructionTemplate = `
    You are a helpful assistant who summarize accounts of Bigfoot sightings. These
    summaries will be used to generate embeddings for the sightings so that they can be
    searched using vector search. You will be given an account of a Bigfoot sighting and
    you will summarize it using no more than 512 words. You will ONLY return the summary,
    and nothing more. You will NEVER return more than 512 words.`

  const sightingTemplate = "{sighting}"

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", instructionTemplate],
    ["system", sightingTemplate]
  ])

  const summarizationModel = new LlamaCpp({
    modelPath: "./models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
  })

  const summary = await chatPrompt.pipe(summarizationModel).invoke({
    sighting: sighting.observed
  })

  return summary
}