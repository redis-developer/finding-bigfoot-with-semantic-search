import { EVENT_IDLE_TIME as idleTime, STREAM_WAIT_TIME as waitTime } from './config.js'
import { redis } from './redis.js'


export async function createConsumerGroup(stream, group) {
  try {
    await redis.xGroupCreate(stream, group, '$', { MKSTREAM: true })
  } catch(error) {
    if (error.message !== "BUSYGROUP Consumer Group name already exists") throw error
    console.log("Consumer group already exists, skipping creation")
  }
}

export async function removeIdleConsumers(stream, group) {
  const consumers = await redis.xInfoConsumers(stream, group)
  for (const consumer of consumers) {
    if (consumer.pending === 0) {
      await redis.xGroupDelConsumer(stream, group, consumer.name)
    }
  }
}

export async function claimPendingEvent(stream, group, consumer) {
  const response = await redis.xAutoClaim(
    stream, group, consumer,
    idleTime, '-', { COUNT: 1 })

  const event = response.messages.length === 0 ? null : response.messages[0]
  return event
}

export async function readNextEvent(stream, group, consumer) {

  const response = await redis.xReadGroup(group, consumer, [
    { key: stream, id: '>' }
  ], {
    COUNT: 1,
    BLOCK: waitTime
  })

  const event = response === null ? null : response[0].messages[0]
  return event
}

export async function acknowledgeEvent(stream, group, event) {
  await redis.xAck(stream, group, event.id)
}
