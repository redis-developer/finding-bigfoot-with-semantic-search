import { LlamaCpp } from '@langchain/community/llms/llama_cpp'
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'

// create the summarization model
export const summarizationModel = new LlamaCpp({
  modelPath: 'models/mistral-7b-instruct-v0.2.Q4_K_M.gguf'
})

// create the embedding model
export const embeddingModel = new HuggingFaceTransformersEmbeddings({
  modelName: 'Xenova/all-MiniLM-L6-v2'
})
