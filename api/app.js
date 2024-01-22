import express from 'express'

import { EXPRESS_PORT } from './config.js'
import { search, save } from './embed.js'


const app = express()

app.use(express.json())

app.post('/search', async (req, res) => {
  const query = req.body.query
  const count = req.body.count ?? 1
  const results = await search(query, count)
  res.send(results)
})

app.post('/load', async (req, res) => {
  const sighting = req.body
  const result = await save(sighting)
  res.send({ "response": result })
})

app.listen(EXPRESS_PORT, () => console.log(`👣 Server running on port ${EXPRESS_PORT} 👣`))
