import { ulid } from 'ulid'

import { redis, waitForRedis } from './redis.js'
import { summarize, embed } from './embed.js'
import { BIGFOOT_GROUP, BIGFOOT_STREAM, EVENT_IDLE_TIME, STREAM_WAIT_TIME } from './config.js'

const consumerName = ulid()

// wait for Redis to finish loading
await waitForRedis()

// create the consumer group
await createConsumerGroup()

// remove idle and empty consumers from the group
await removeIdleConsumers()

// loop to read from stream
while (true) {

  try {
    // claim old messages first
    let event = await claimPendingSighting()
    console.log("Claimed pending event", event)

    // read from the stream if nothing claimed
    if (event === null) {
      event = await readSightingFromStream()
      console.log("Read event", event)
    }

    // skip if nothing is returned
    if (event === null) {
      console.log("No message received, looping.")
      continue
    }

    // get the message contents
    const id = event.id
    const sightingId = event.message.id
    const sightingText = event.message.observed

    // save the embedding
    await saveEmbedding(sightingId, sightingText)

    // acknowledge the message
    await acknowledgeMessage(id)

  } catch (error) {
    console.log("Error reading from stream", error)
  }
}

async function createConsumerGroup() {
  try {
    await redis.xGroupCreate(BIGFOOT_STREAM, BIGFOOT_GROUP, '$', { MKSTREAM: true })
  } catch(error) {
    if (error.message !== "BUSYGROUP Consumer Group name already exists") throw error
    console.log("Consumer group already exists, skipping creation")
  }
}

async function removeIdleConsumers() {
  const consumers = await redis.xInfoConsumers(BIGFOOT_STREAM, BIGFOOT_GROUP)
  for (const consumer of consumers) {
    if (consumer.pending === 0) {
      await redis.xGroupDelConsumer(BIGFOOT_STREAM, BIGFOOT_GROUP, consumer.name)
    }
  }
}

async function claimPendingSighting() {
  const response = await redis.xAutoClaim(BIGFOOT_STREAM, BIGFOOT_GROUP, consumerName, EVENT_IDLE_TIME, '-', { COUNT: 1 })
  return response.messages.length === 0 ? null : response.messages[0]
}

async function readSightingFromStream() {
  const response = await redis.xReadGroup(BIGFOOT_GROUP, consumerName, [
    { key: BIGFOOT_STREAM, id: '>' }
  ], {
    COUNT: 1,
    BLOCK: STREAM_WAIT_TIME
  })

  return response === null ? null : response[0].messages[0]
}

async function saveEmbedding(id, text) {

  const key = `bigfoot:sighting:${id}`

  const summary = await summarize(text)
  const embeddingBytes = await embed(summary)

  await redis.hSet(key, { summary, embedding: embeddingBytes })
}

async function acknowledgeMessage(id) {
  await redis.xAck(BIGFOOT_STREAM, BIGFOOT_GROUP, id)
}
