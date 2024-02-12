<script>
	import { applyAction, enhance } from '$app/forms'

	export let form
</script>

<h2 class="text-slate-600 text-2xl font-extrabold tracking-tight">Search</h2>
<p class="mt-2 text-slate-700">Search for BigFoot sightings ...</p>

<!-- custom enhance to prevent default form-reset behavior-->
<form
	class="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6"
	method="POST"
	use:enhance={() => async ({ result }) => await applyAction(result)}
>
  <div class="col-span-full">
    <label for="query" class="block text-sm font-medium leading-6 text-gray-900">Query</label>
    <div class="mt-1">
      <input type="text" name="query" id="query" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2 sm:col-start-1">
    <label for="state" class="block text-sm font-medium leading-6 text-gray-900">State</label>
    <div class="mt-1">
      <input type="text" name="state" id="state" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="county" class="block text-sm font-medium leading-6 text-gray-900">County</label>
    <div class="mt-1">
      <input type="text" name="county" id="county" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="classification" class="block text-sm font-medium leading-6 text-gray-900">Classification</label>
    <div class="mt-1">
      <select id="classification" name="classification" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
        <option value="">Any</option>
        <option>Class A</option>
        <option>Class B</option>
      </select>
    </div>
  </div>

  <div class="sm:col-span-2 sm:col-start-1">
    <label for="lat" class="block text-sm font-medium leading-6 text-gray-900">Latitude</label>
    <div class="mt-1">
      <input type="number" step="0.00001" name="lat" id="lat" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="long" class="block text-sm font-medium leading-6 text-gray-900">Longitude</label>
    <div class="mt-1">
      <input type="number" step="0.00001" name="long" id="long" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="radius" class="block text-sm font-medium leading-6 text-gray-900">Radius</label>
    <div class="mt-1">
      <input type="number" step="0.00001" name="radius" id="radius" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2 sm:col-start-1">
    <label for="minTemp" class="block text-sm font-medium leading-6 text-gray-900">Min Temp</label>
    <div class="mt-1">
      <input type="number" step="0.00001" name="minTemp" id="minTemp" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="maxTemp" class="block text-sm font-medium leading-6 text-gray-900">Max Temp</label>
    <div class="mt-1">
      <input type="number" step="0.00001" name="maxTemp" id="maxTemp" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <div class="sm:col-span-2">
    <label for="count" class="block text-sm font-medium leading-6 text-gray-900">Count</label>
    <div class="mt-1">
      <input type="number" name="count" id="count" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    </div>
  </div>

  <button class="mt-4 sm:col-span-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    Submit
</button>
</form>

{#if form}
  <div class="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
	{#each form as result}
		<div class="bg-white border border-gray-400 rounded-md p-4">
      <h3 class="font-semibold text-base">{result.title}</h3>
      <!-- score guage -->
      <div class="mt-2 flex w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" role="progressbar" aria-valuenow={result.__embedding_score * 100} aria-valuemin="0" aria-valuemax="100">
        <div class="flex flex-col justify-center rounded-full overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style="width: {result.__embedding_score * 100}%"></div>
      </div>
			<p class="mt-2 text-slate-600 text-sm">{result.summary}</p>
      <p class="mt-2 text-slate-800">{result.classification} Sighting</p>
      <p class="mt-2 text-slate-800 text-sm flex items-center">
        <img class="w-5 h-5 text-slate-600 mr-1.5" src="/public_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.county} {result.state}
      </p>
      <p class="mt-2 text-slate-800 text-sm flex items-center">
        {#if result.latitude}
          <img class="w-5 h-5 text-slate-600 mr-1.5" src="/location_on_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.latitude}, {result.longitude}
        {:else}
          <img class="w-5 h-5 text-slate-600 mr-1.5" src="/not_listed_location_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> Unknown location
        {/if}
      </p>
      {#if result.highTemp}
        <p class="mt-2 text-slate-800 text-sm flex items-center">
          <img class="w-5 h-5 text-slate-600 mr-1.5" src="/thermostat_FILL0_wght300_GRAD0_opsz24.svg" alt="" /> {result.highTemp}
        </p>
      {/if}

		</div>
  {:else}
    <p>No results found</p>
	{/each}
  </div>
{/if}

<!-- uncomment to see raw result data
<pre>{JSON.stringify(form, null, 2)}</pre>
-->

