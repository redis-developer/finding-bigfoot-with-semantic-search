import { SchemaFieldTypes, VectorAlgorithms, createClient } from 'redis'

// connect to redis
export const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()

// create index if needed
const indices = await redis.ft._list()
if (!indices.includes('bigfoot:sighting:index')) await createIndex()

async function createIndex() {
  await redis.ft.create(
    'bigfoot:sighting:index', {
      'id': SchemaFieldTypes.TAG,
      'title': SchemaFieldTypes.TEXT,
      'observed': SchemaFieldTypes.TEXT,
      'classification': SchemaFieldTypes.TAG,
      'county': SchemaFieldTypes.TAG,
      'state': SchemaFieldTypes.TAG,
      'latlng': SchemaFieldTypes.GEO,
      'embedding': {
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.FLAT,
        TYPE: 'FLOAT32',
        DIM: 384,
        DISTANCE_METRIC: 'COSINE'
      }
    }, {
      ON: 'HASH',
      PREFIX: 'bigfoot:sighting:'
    }
  )
}
