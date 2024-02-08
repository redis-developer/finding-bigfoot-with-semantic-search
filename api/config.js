import 'dotenv/config'

export const EXPRESS_PORT = Number(process.env.EXPRESS_PORT ?? 80)
export const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost'
export const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379)

// TODO: add stream name to config
