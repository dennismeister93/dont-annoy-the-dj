<script lang="ts">
	import { onMount } from 'svelte';
	import type { SearchTrackInformation } from '../../routes/api/search/[searchValue]/+server';
	import Keyboard from './Keyboard.svelte';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'Such dein Lied!' }: Props = $props();
	let searchInput: string = $state('');
	let searchResponse: SearchTrackInformation[] = $state([]);
	let showKeyboard: boolean = $state(false);

	let timeOut: number;

	function handleInput(input: string) {
		document.querySelector<HTMLInputElement>('.input')!.value = input;
		searchInput = input;
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
				searchResponse = data;
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		}, 500);
	}

	async function handleAdd(trackId: string) {
		await fetch(`/api/queue/add/${trackId}`, { method: 'POST' });
		searchResponse = searchResponse.filter((item) => item.id !== trackId);
	}

	onMount(() => {
		document.addEventListener('click', (event) => {
			if (
				/**
				 * Hide the keyboard when you're not clicking it or when clicking an input
				 * If you have installed a "click outside" library, please use that instead.
				 */
				!(event.target as HTMLElement).className.includes('input') &&
				!(event.target as HTMLElement).className.includes('hg-button') &&
				!(event.target as HTMLElement).className.includes('hg-row') &&
				!(event.target as HTMLElement).className.includes('simple-keyboard')
			) {
				showKeyboard = false;
			}
		});
	});
</script>

<div class="col-span-2 row-span-2 gap-2">
	<aside>
		<form method="POST">
			<input
				class="input bg-surface-400 placeholder:text-surface-300 w-36 sm:w-64"
				id="search"
				{placeholder}
				bind:value={searchInput}
				oninput={() => handleInput(searchInput)}
				onfocus={() => (showKeyboard = true)}
			/>
			{#if showKeyboard}
				<Keyboard {handleInput} />
			{/if}
		</form>
	</aside>
	<aside class="mt-5 gap-5">
		{#each searchResponse as track}
			<div class="flex flex-row items-center gap-2">
				<img src={track.image.url} alt={track.track} height="120" width="120" />
				<div>Titel: {track.track}</div>
				<div>Artists: {track.artists}</div>
				<button type="button" class="btn-icon preset-filled" onclick={() => handleAdd(track.id)}
					>&rarr;</button
				>
			</div>
		{/each}
	</aside>
</div>
