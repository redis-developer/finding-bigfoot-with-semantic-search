import { ulid } from 'ulid'

import { redis } from './redis.js'
import { summarize, embed } from './embed.js'

// TODO: so many things to config

const streamName = 'bigfoot:sighting:reported'
const groupName = 'bigfoot:sighting:group'
const consumerName = ulid()


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
    await redis.xGroupCreate(streamName, groupName, '$', { MKSTREAM: true })
  } catch(error) {
    if (error.message !== "BUSYGROUP Consumer Group name already exists") throw error
    console.log("Consumer group already exists, skipping creation")
  }
}

async function removeIdleConsumers() {
  const consumers = await redis.xInfoConsumers(streamName, groupName)
  for (const consumer of consumers) {
    if (consumer.pending === 0) {
      await redis.xGroupDelConsumer(streamName, groupName, consumer.name)
    }
  }
}

async function claimPendingSighting() {
  const response = await redis.xAutoClaim(streamName, groupName, consumerName, 600000, '-', { COUNT: 1 })
  return response.messages.length === 0 ? null : response.messages[0]
}

async function readSightingFromStream() {
  const response = await redis.xReadGroup(groupName, consumerName, [
    { key: streamName, id: '>' }
  ], {
    COUNT: 1,
    BLOCK: 5000
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
  await redis.xAck(streamName, groupName, id)
}

