// Import express module
import express from 'express'
import { embedAndSave, queryRedis } from './embed.js'

// Create an instance of express
const app = express()

// Use express.json() middleware for parsing JSON bodies
app.use(express.json())

// Define a GET route
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.post('/search', async (req, res) => {
  const query = req.body.query
  const results = await queryRedis(query)
  res.send(results)
})

// Define a POST route
app.post('/load', async (req, res) => {
  const sighting = req.body

  console.log('Received sighting:', sighting.observed)
  const summary = await embedAndSave(sighting)
  res.send(summary)
})

// Start the server on port 3000
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
