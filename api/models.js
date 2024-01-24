import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'


let embeddingModel = null

export function fetchEmbeddingModel(cacheBust = false) {
  if (embeddingModel && !cacheBust) return embeddingModel
  embeddingModel = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2'
  })
  return embeddingModel
}
