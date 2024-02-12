import { save } from "$lib/embed"
import { json } from "@sveltejs/kit"

export async function POST({ request }) {
  const sighting = await request.json()
  const response = await save(sighting)
  return json({ response })
}