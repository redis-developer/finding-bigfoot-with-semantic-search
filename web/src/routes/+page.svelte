<script>
	import { applyAction, enhance } from '$app/forms'

	export let form
</script>

<h1>Bigfoot Search</h1>
<p>Search for BigFoot sightings ...</p>

<!-- custom enhance to prevent default form-reset behavior-->
<form
	method="POST"
	use:enhance={() =>
		async ({ result }) =>
			await applyAction(result)}
>
	<label>
		State
		<input type="text" name="state" />
	</label>

	<label>
		County
		<input type="text" name="county" />
	</label>

	<label>
		Classification
		<input type="text" name="classification" />
	</label>

	<label>
		Temperature Range
		<input type="number" name="minTemp" />
		<input type="number" name="maxTemp" />
	</label>

	<label>
		Location
		<input type="number" step="0.000001" name="long" />
		<input type="number" step="0.000001" name="lat" />
		<input type="number" step="0.000001" name="radius" />
	</label>

	<label>
		Count
		<input type="number" name="count" value="1" />
	</label>

	<label>
		Query
		<textarea name="query"></textarea>
	</label>

	<button>Submit</button>
</form>

{#if form}
	{#each form as result}
		<div>
			<progress value={result.__embedding_score}></progress>
			<h2>{result.title}</h2>
			<p>{result.summary}</p>
			<p>{result.observed}</p>
			<p>{result.classification} Sighting</p>
			<p><img src="/public_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.county} {result.state}</p>
			{#if result.latitude}
				<p><img src="/location_on_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.latitude}, {result.longitude}</p>
			{:else}
				<p><img src="/not_listed_location_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> Unknown location</p>
			{/if}
			{#if result.highTemp}
				<p><img src="/thermostat_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.highTemp}</p>
			{/if}
		</div>
	{/each}
{/if}

<!-- uncomment to see raw result data
<pre>{JSON.stringify(form, null, 2)}</pre>
-->

<style>
	label {
		display: block;
	}

	img {
		width: 24px;
		height: 24px;
	}

	progress {
		width: 36px;
	}
</style>
