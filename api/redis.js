import { SchemaFieldTypes, VectorAlgorithms, createClient } from 'redis'

// connect to redis
export const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()

// create index if needed
if (!await indexExists()) await createIndex()

/**
 * Determines if the index has been created or not.
 */
async function indexExists() {
  const indices = await redis.ft._list()
  return indices.includes('bigfoot:sighting:index')
}

/**
 * Creates the index.
 */
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
      'highTemp': SchemaFieldTypes.NUMERIC,
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
