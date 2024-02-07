import { createClient } from 'redis'

import { REDIS_HOST, REDIS_PORT } from './config.js'


// connect to redis
export const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } })
redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()
