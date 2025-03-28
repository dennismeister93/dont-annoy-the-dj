<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { TrackInformation } from '../../routes/api/queue/+server';
	import Track from './Track/Track.svelte';
	import TrackContainer from './Track/TrackContainer.svelte';
	let song: TrackInformation | undefined = $state();
	let nextTracks: TrackInformation[] = $state([]);

	async function getNowPlaying() {
		if (browser) {
			const response = await fetch(`/api/queue`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const { currentlyPlayingRes, nextTracksRes } = await response.json();
			song = currentlyPlayingRes;
			nextTracks = nextTracksRes;
		}
	}

	onMount(async () => {
		getNowPlaying();
	});

	setInterval(() => {
		getNowPlaying();
	}, 5000);
</script>

<section class="flex h-screen flex-col p-4">
	<div class="content-center">
		{#if song}
			<Track track={song} variant="playing" />
		{:else}
			<svg
				class="top-0 inline h-4 w-4 -translate-y-[1.5px]"
				fill="currentColor"
				viewBox="0 0 32 32"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16 0c-8.803 0-16 7.197-16 16s7.197 16 16 16c8.803 0 16-7.197 16-16s-7.12-16-16-16zM23.36 23.12c-0.319 0.479-0.881 0.64-1.36 0.317-3.76-2.317-8.479-2.797-14.083-1.52-0.557 0.165-1.037-0.235-1.199-0.72-0.156-0.557 0.24-1.036 0.719-1.197 6.084-1.36 11.365-0.803 15.521 1.76 0.563 0.24 0.64 0.88 0.401 1.36zM25.281 18.719c-0.401 0.563-1.12 0.803-1.683 0.401-4.317-2.641-10.88-3.437-15.916-1.839-0.641 0.156-1.365-0.161-1.521-0.803-0.161-0.64 0.156-1.359 0.797-1.52 5.844-1.761 13.041-0.876 18 2.161 0.484 0.24 0.724 1.041 0.323 1.599zM25.443 14.24c-5.125-3.043-13.683-3.36-18.563-1.839-0.801 0.239-1.599-0.24-1.839-0.964-0.239-0.797 0.24-1.599 0.959-1.839 5.683-1.681 15.041-1.359 20.964 2.161 0.719 0.401 0.957 1.36 0.557 2.079-0.401 0.563-1.36 0.801-2.079 0.401z"
				/>
			</svg>
			<strong>Not playing</strong> - <span class="text-gray-500">Spotify</span>
		{/if}
	</div>

	<hr class="hr my-5 border-t-2" />

	<div class="text-primary-500 flex w-full items-center justify-center">
		<span>🔥 Nächster Banger 🔥</span>
	</div>

	{#if nextTracks}
		<TrackContainer tracks={nextTracks} variant="queue" />
	{/if}
</section>

<style>
</style>
