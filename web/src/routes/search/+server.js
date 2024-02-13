import { search } from '$lib/embed'
import { json } from '@sveltejs/kit'

export async function POST({ request }) {
  const body = await request.json()
  const query = body.query
	const params = body.params ?? {}
	const count = body.count ?? 1
  const results = await search(query, params, count)
	return json(results)
}
