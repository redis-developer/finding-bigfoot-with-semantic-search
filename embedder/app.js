import { ulid } from 'ulid'

import { redis } from './redis.js'
import { summarize, embed } from './embed.js'

// TODO: so many things to config

const streamName = 'bigfoot:sighting:reported'
const groupName = 'bigfoot:sighting:group'
const consumerName = ulid()


// create the consumer group
await createConsumerGroup()

// TODO: remove idle consumers from the group before starting
// XINFO CONSUMERS bigfoot:sighting:reported bigfoot:sighting:group
// XGROUP DELCONSUMER bigfoot:sighting:reported bigfoot:sighting:group <consumerName>
// Only remove if pending messages is zero

// loop to read from stream
while (true) {

  try {
    // TODO: claim old messages for processing first
    // XAUTOCLAIM bigfoot:sighting:reported bigfoot:sighting:group <claimingConsumer> 600000 - COUNT 1

    // read from the stream
    const response = await readSightingFromStream()

    // skip if nothing is returned
    if (response === null) {
      console.log("No message received, looping.")
      continue
    }

    // get the message contents
    const id = response[0].messages[0].id
    const message = response[0].messages[0].message
    const sightingId = message.id
    const sightingText = message.observed

    // save the embedding
    await saveEmbedding(sightingId, sightingText)

    // acknowledge the message
    await acknowledgeMessage(id)

  } catch (error) {
    console.log("Error reading from stream", error)
  }

  // TODO: some sort of shutdown handling to remove the consumer from the group
  // XGROUP DELCONSUMER bigfoot:sighting:reported bigfoot:sighting:group <consumerName>
  // Only remove if pending messages is zero
}

async function createConsumerGroup() {
  try {
    await redis.xGroupCreate(streamName, groupName, '$', { MKSTREAM: true })
  } catch(error) {
    if (error.message !== "BUSYGROUP Consumer Group name already exists") throw error
    console.log("Consumer group already exists, skipping creation")
  }
}

async function readSightingFromStream() {

  return await redis.xReadGroup(groupName, consumerName, [
    { key: streamName, id: '>' }
  ], {
    COUNT: 1,
    BLOCK: 5000
  })
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

