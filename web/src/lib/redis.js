import { SchemaFieldTypes, VectorAlgorithms, createClient } from 'redis'

import { BIGFOOT_PREFIX, REDIS_HOST, REDIS_PORT } from '$env/static/private'

export const BIGFOOT_INDEX = process.env.BIGFOOT_INDEX ?? `${BIGFOOT_PREFIX}:index`
export const BIGFOOT_STREAM = process.env.BIGFOOT_STREAM ?? `${BIGFOOT_PREFIX}:reported`

// connect to redis
export const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } })
redis.on('error', err => console.log('Redis Client Error', err))
await redis.connect()

// wait for Redis to finish loading
await waitForRedis()

// create index if needed
if (!(await indexExists())) await createIndex()

/**
 * Wait for Redis to finish loading.
 */
async function waitForRedis() {
	let loaded = false

	while (!loaded) {
		loaded = await isReady()
		if (!loaded) console.log('Redis is loading...')
	}

	console.log('Redis is ready!')
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
		BIGFOOT_INDEX,
		{
			id: SchemaFieldTypes.TAG,
			title: SchemaFieldTypes.TEXT,
			observed: SchemaFieldTypes.TEXT,
			classification: SchemaFieldTypes.TAG,
			county: SchemaFieldTypes.TAG,
			state: SchemaFieldTypes.TAG,
			latlng: SchemaFieldTypes.GEO,
			highTemp: SchemaFieldTypes.NUMERIC,
			embedding: {
				type: SchemaFieldTypes.VECTOR,
				ALGORITHM: VectorAlgorithms.FLAT,
				TYPE: 'FLOAT32',
				DIM: 384,
				DISTANCE_METRIC: 'COSINE',
			},
		},
		{
			ON: 'HASH',
			PREFIX: `${BIGFOOT_PREFIX}:`,
		},
	)
}
