import express from 'express'
import cors from 'cors'

import { EXPRESS_BASE_URL, EXPRESS_PORT } from './config.js'
import { fetch, search, save } from './main.js'


const app = express()

const server = express()
server.use(cors())
server.use(EXPRESS_BASE_URL, app)

app.use(express.json())

app.post('/search', async (req, res) => {
  const query = req.body.query
  const params = req.body.params ?? {}
  const count = req.body.count ?? 1
  const results = await search(query, params, count)
  res.send(results)
})

app.post('/load', async (req, res) => {
  const sighting = req.body
  const result = await save(sighting)
  res.send({ "response": result })
})

app.post('/fetch', async (req, res) => {
  const id = req.body.id
  const result = await fetch(id)
  res.send(result)
})

server.listen(EXPRESS_PORT, () => console.log(`👣 Server running on port ${EXPRESS_PORT} at ${EXPRESS_BASE_URL} 👣`))
