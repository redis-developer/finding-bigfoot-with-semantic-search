import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'
import { LlamaCpp } from '@langchain/community/llms/llama_cpp'

let summarizationModel = null

export function createSummarizationModel(cacheBust = false) {
  if (summarizationModel && !cacheBust) return summarizationModel
  summarizationModel = new LlamaCpp({
    modelPath: 'models/mistral-7b-instruct-v0.2.Q4_K_M.gguf',
    batchSize: 8192,
    contextSize: 8192
  })
  return summarizationModel
}

// export const summarizationModel = new LlamaCpp({
//   modelPath: 'models/mistral-7b-instruct-v0.2.Q4_K_M.gguf',
//   batchSize: 8192,
//   contextSize: 8192
// })

export const embeddingModel = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2'
})
