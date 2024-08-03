import { SchemaFieldTypes, VectorAlgorithms, createClient } from 'redis'

import { BIGFOOT_INDEX, BIGFOOT_PREFIX, REDIS_HOST, REDIS_PORT } from './config.js'

/*
  NOTE: This code create the index if it is missing but it also assumes that
  the index will not change. If you change the index, you'll need to remove it
  manually using the following command before running the server again:

    redis.cloud> FT.DROPINDEX bigfoot:sighting:index

  Also, if you changed the BIGFOOT_INDEX or BIGFOOT_PREFIX values, the index
  name in the command above will need to be updated accordingly.
*/

export const redis = await connectToRedis()
await waitForRedis()
if (!await indexExists()) await createIndex()


/**
 * Connect to Redis
 */
async function connectToRedis() {
  const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } })
  redis.on('error', (err) => console.log('Redis Client Error', err))
  await redis.connect()
  return redis
}

/**
 * Wait for Redis to finish loading.
 */
async function waitForRedis() {
  let loaded = false

  while (!loaded) {
    loaded = await isReady()
    if (!loaded) console.log("Redis is loading...")
  }

  console.log("Redis is ready!")
}

/**
 * Determine if Redis is done loading or not.
 */
export async function isReady() {
  const info = await redis.info('persistence')
  const lines = info.split('\r\n')
  const loadingLine = lines.find(line => line.startsWith('loading:'))
  const loadingValue = loadingLine.split(':')[1]
  return loadingValue === '0'
}

/**
 * Determines if the index has been created or not.
 */
async function indexExists() {
  const indices = await redis.ft._list()
  return indices.includes(BIGFOOT_INDEX)
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
        DISTANCE_METRIC: 'L2'
      }
    }, {
      ON: 'HASH',
      PREFIX: `${BIGFOOT_PREFIX}:`
    }
  )
}
