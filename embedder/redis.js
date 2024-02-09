import { createClient } from 'redis'

import { REDIS_HOST, REDIS_PORT } from './config.js'


// connect to redis
export const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } })
redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()

/**
 * Wait for Redis to finish loading.
 */
export async function waitForRedis() {
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
