<script>
  import "../app.pcss"
</script>

<svelte:head>
  <title>Bigfoot Sightings!</title>
</svelte:head>

<div class="m-4 container mx-auto px-4">
  <nav>
    <h1 class="text-slate-700 text-4xl font-extrabold tracking-tight">Bigfoot Sightings!</h1>
  </nav>

  <main class="mt-4">
    <slot></slot>
  </main>
</div>