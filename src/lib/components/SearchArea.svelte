<script lang="ts">
	import { addToQueue } from '../../routes/api/addToQueue.svelte';
	import type { SearchTrackInformation } from '../../routes/api/search/[searchValue]/+server';

	interface Props {
		token: string;
		placeholder?: string;
	}

	let { token, placeholder = 'Such dein Lied!' }: Props = $props();
	let searchInput: string = $state('');
	let searchResponse: SearchTrackInformation[] = $state([]);

	let timeOut: number;

	function handleInput() {
		clearTimeout(timeOut);
		timeOut = setTimeout(async () => {
			try {
				if (searchInput === '') {
					searchResponse = [];
					return;
				}
				const response = await fetch(`/api/search/${searchInput}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				console.log('Fetched data:', data);
				searchResponse = data;
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		}, 500);
	}

	async function handleAdd(trackId: string) {
		await addToQueue(token, trackId);
	}
</script>

<div class="col-span-2 row-span-2 gap-2">
	<aside>
		<form method="POST">
			<input
				class="input bg-surface-400 placeholder:text-surface-300 w-36 sm:w-64"
				id="search"
				{placeholder}
				bind:value={searchInput}
				oninput={handleInput}
			/>
		</form>
	</aside>
	<aside class="mt-5 gap-5">
		{#each searchResponse as track}
			<div role="none" class="flex flex-row items-center gap-2" onclick={() => handleAdd(track.id)}>
				<img src={track.image.url} alt={track.track} height="120" width="120" />
				<div>Titel: {track.track}</div>
			</div>
		{/each}
	</aside>
</div>
