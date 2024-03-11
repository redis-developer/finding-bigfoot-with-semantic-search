import 'dotenv/config'

export const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost'
export const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379)

export const BIGFOOT_PREFIX = process.env.BIGFOOT_PREFIX ?? 'bigfoot:sighting'
export const BIGFOOT_STREAM = process.env.BIGFOOT_STREAM ?? `${BIGFOOT_PREFIX}:reported`
export const BIGFOOT_GROUP = process.env.BIGFOOT_GROUP ?? `${BIGFOOT_PREFIX}:group`

export const EVENT_IDLE_TIME = 600000
export const STREAM_WAIT_TIME = 5000
