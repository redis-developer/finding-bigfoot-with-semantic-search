// @ts-nocheck
import { search } from '$lib/embed.js'

export const actions = {
	default: async event => {
		const data = await event.request.formData()
		const state = data.get('state')
		const county = data.get('county')
		const classification = data.get('classification')
		const minTemp = parseFloat(data.get('minTemp'))
		const maxTemp = parseFloat(data.get('maxTemp'))
		const long = parseFloat(data.get('long'))
		const lat = parseFloat(data.get('lat'))
		const radius = parseFloat(data.get('radius'))
		const query = data.get('query')
		const count = parseInt(data.get('count') || '1')
		const params = { state, county, classification, minTemp, maxTemp, long, lat, radius }
		return await search(query, params, count)
	},
}
