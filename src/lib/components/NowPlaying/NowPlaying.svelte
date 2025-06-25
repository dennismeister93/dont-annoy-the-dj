<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Track from '../Track/Track.svelte';
	import TrackContainer from '../Track/TrackContainer.svelte';
	import type { TrackInformation } from '$lib/types';
	import NotPlaying from './NotPlaying.svelte';
	let song: TrackInformation | undefined = $state();
	let nextTracks: TrackInformation[] = $state([]);
	let interval: number | null = null;

	async function getNowPlaying() {
		if (browser) {
			try {
				const response = await fetch(`/api/queue`);
				if (!response.ok) {
					console.warn(`Failed to fetch: ${response.status} ${response.statusText}`);
					song = undefined;
					nextTracks = [];
					return;
				}

				const { currentlyPlayingRes, nextTracksRes } = await response.json();
				song = currentlyPlayingRes;
				nextTracks = nextTracksRes;
			} catch (error) {
				console.warn('Could not fetch now playing data.');
				song = undefined;
				nextTracks = [];
			}
		}
	}

	onMount(async () => {
		interval = setInterval(getNowPlaying, 5000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<section class="flex h-screen flex-col p-4">
	<div class="h-[6rem] content-center">
		{#if song?.progress?.isPlaying}
			<Track track={song} variant="playing" />
		{:else}
			<NotPlaying />
		{/if}
	</div>

	<hr class="hr my-5 border-t-2" />

	{#if song?.progress?.isPlaying && nextTracks}
		<div
			class="text-secondary-700 dark:text-secondary-400 mb-2 flex w-full items-center justify-center font-bold"
		>
			<span>🔥 Next Tracks 🔥</span>
		</div>
		<TrackContainer tracks={nextTracks} variant="queue" />
	{/if}
</section>
