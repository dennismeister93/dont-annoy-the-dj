<script lang="ts">
	import { onMount } from 'svelte';
	import Keyboard from './Keyboard.svelte';
	import Track from './Track/Track.svelte';
	import type { TrackInformation } from '../../routes/api/queue/+server';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'Such dein Lied!' }: Props = $props();
	let searchInput: string = $state('');
	let searchResponse: TrackInformation[] = $state([]);
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

<section class="p-4">
	<div class="h-[5.9rem] content-center">
		<aside class="h-full place-items-center">
			<input
				class="input bg-surface-400 placeholder:text-surface-300 h-full w-3/4 text-center text-xl transition-all duration-200 focus:scale-110"
				id="search"
				{placeholder}
				bind:value={searchInput}
				oninput={() => handleInput(searchInput)}
				onfocus={() => (showKeyboard = true)}
			/>
		</aside>
	</div>

	<hr class="hr my-5 border-t-2" />
	{#if searchResponse.length > 0}
		<div class="text-primary-500 flex w-full items-center justify-center">
			<span>😍 Gefunden 😍</span>
		</div>
	{/if}
	{#each searchResponse as track}
		<Track {track} {handleAdd} variant={'search'} />
	{/each}
</section>

{#if showKeyboard}
	<Keyboard {handleInput} />
{/if}
