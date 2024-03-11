import { ulid } from 'ulid'

import { BIGFOOT_STREAM as streamKey, BIGFOOT_GROUP as consumerGroupName } from './config.js'
import { summarize, embed } from './embed.js'
import { redis, waitForRedis } from './redis.js'
import { createConsumerGroup, removeIdleConsumers, claimPendingEvent, readNextEvent, acknowledgeEvent } from './stream.js'



// wait for redis to be ready
await waitForRedis()

// create a unique name for this consumer
const consumerName = ulid()

// create the consumer group and remove idle consumers
await createConsumerGroup(streamKey, consumerGroupName)
await removeIdleConsumers(streamKey, consumerGroupName)

// loop forever to read from stream
while (true) {

  try {

    // try to claim an old event first
    let event = await claimPendingEvent(streamKey, consumerGroupName, consumerName)
    if (event) console.log("Claimed pending event", event)

    // read next event from the stream if nothing was claimed
    if (event === null) {
      event = await readNextEvent(streamKey, consumerGroupName, consumerName)
      if (event) console.log("Read event", event)
    }

    // loop if nothing new was found
    if (event === null) {
      console.log("No event received, looping.")
      continue
    }

    // process the event
    await processEvent(event)
    console.log("Processed event", event.id)

    // acknowledge that the event was processed
    await acknowledgeEvent(streamKey, consumerGroupName, event)
    console.log("Acknowledged event", event.id)

  } catch (error) {
    console.log("Error reading from stream", error)
  }
}

async function processEvent(event) {

  // get the message contents
  const sightingId = event.message.id
  const sightingText = event.message.observed

  // summarize and embed the sighting
  const sightingSummary = await summarize(sightingText) // this can take a while
  const embeddingBytes = await embed(sightingSummary)

  // update Hash in Redis with the summary and embedding
  const key = `bigfoot:sighting:${sightingId}`
  await redis.hSet(key, { summary: sightingSummary, embedding: embeddingBytes })

}
