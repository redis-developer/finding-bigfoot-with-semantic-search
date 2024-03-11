import { ulid } from 'ulid'

import { redis, waitForRedis } from './redis.js'
import { summarize, embed } from './embed.js'
import { BIGFOOT_GROUP, BIGFOOT_STREAM, EVENT_IDLE_TIME, STREAM_WAIT_TIME } from './config.js'


// wait for redis to be ready
await waitForRedis()

// create a unique name for this consumer
const consumerName = ulid()

// create the consumer group and remove idle consumers
await createConsumerGroup()
await removeIdleConsumers()

// loop forever to read from stream
while (true) {

  try {

    // try to claim an old event first
    let event = await claimPendingEvent(consumerName)
    if (event) console.log("Claimed pending event", event)

    // read next event from the stream if nothing was claimed
    if (event === null) {
      event = await readNextEvent(consumerName)
      if (event) console.log("Read event", event)
    }

    // loop if nothing new was found
    if (event === null) {
      console.log("No event received, looping.")
      continue
    }

    // process the event
    const id = await processSighting(event)
    console.log("Processed event", id)

    // acknowledge that the event was processed
    await acknowledgeEvent(id)
    console.log("Acknowledged event", id)

  } catch (error) {
    console.log("Error reading from stream", error)
  }
}

async function processSighting(event) {

  // get the message contents
  const id = event.id
  const sightingId = event.message.id
  const sightingText = event.message.observed

  // save the embedding
  await saveEmbedding(sightingId, sightingText)

  // return the id
  return id
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

async function claimPendingEvent(consumerName) {
  const response = await redis.xAutoClaim(
    BIGFOOT_STREAM, BIGFOOT_GROUP, consumerName,
    EVENT_IDLE_TIME, '-', { COUNT: 1 })

  const event = response.messages.length === 0 ? null : response.messages[0]
  return event
}

async function readNextEvent(consumerName) {

  const response = await redis.xReadGroup(BIGFOOT_GROUP, consumerName, [
    { key: BIGFOOT_STREAM, id: '>' }
  ], {
    COUNT: 1,
    BLOCK: STREAM_WAIT_TIME
  })

  const event = response === null ? null : response[0].messages[0]
  return event
}

async function saveEmbedding(id, text) {

  const key = `bigfoot:sighting:${id}`
  const summary = await summarize(text)
  const embeddingBytes = await embed(summary)

  await redis.hSet(key, { summary, embedding: embeddingBytes })
}

async function acknowledgeEvent(id) {
  await redis.xAck(BIGFOOT_STREAM, BIGFOOT_GROUP, id)
}
