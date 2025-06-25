<script lang="ts">
	import { onMount } from 'svelte';
	import Keyboard from './Keyboard.svelte';
	import TrackContainer from '../Track/TrackContainer.svelte';
	import { PUBLIC_VIRTUAL_KEYBOARD } from '$env/static/public';
	import type { TrackInformation } from '$lib/types';

	const VIRTUAL_KEYBOARD_ENABLED = PUBLIC_VIRTUAL_KEYBOARD === 'true';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'Search your track!' }: Props = $props();
	let searchInput: string = $state('');
	let searchResponse: TrackInformation[] = $state([]);
	let showKeyboard: boolean = $state(false);

	let timeOut: number;

	function handleInput(input: string) {
		searchInput = input;

		clearTimeout(timeOut);
		timeOut = setTimeout(async () => {
			if (searchInput.trim() === '') {
				searchResponse = [];
				return;
			}

			try {
				const response = await fetch(`/api/search/${encodeURIComponent(searchInput)}`);
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

	function clearInput() {
		searchInput = '';
		clearTimeout(timeOut);
	}

	async function handleAdd(trackId: string) {
		await fetch(`/api/queue/add/${trackId}`, { method: 'POST' });
		searchResponse = searchResponse.filter((item) => item.id !== trackId);
	}

	onMount(() => {
		if (!VIRTUAL_KEYBOARD_ENABLED) return;

		document.addEventListener('click', (event) => {
			if (
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

<section class="flex h-screen flex-col p-4">
	<div class="h-[6rem] place-items-center">
		<aside class="relative flex h-full w-3/4 flex-row place-items-center">
			<input
				class="input bg-surface-400 placeholder:text-surface-300 h-full w-full rounded-md pr-10 text-center text-xl transition-all duration-200 focus:scale-110"
				id="search"
				{placeholder}
				bind:value={searchInput}
				oninput={() => handleInput(searchInput)}
				onfocus={() => {
					if (VIRTUAL_KEYBOARD_ENABLED) showKeyboard = true;
				}}
			/>

			{#if searchInput}
				<button
					type="button"
					class="bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-400 dark:hover:bg-secondary-500 absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-white"
					onclick={clearInput}
				>
					<span class="text-sm leading-none">×</span>
				</button>
			{/if}
		</aside>
	</div>

	<hr class="hr my-5 border-t-2" />

	{#if searchResponse.length > 0}
		<div
			class="text-secondary-700 dark:text-secondary-400 mb-2 flex w-full items-center justify-center font-bold"
		>
			<span>😍 Found 😍</span>
		</div>
	{/if}

	<TrackContainer tracks={searchResponse} variant="search" {handleAdd} />
</section>

{#if VIRTUAL_KEYBOARD_ENABLED && showKeyboard}
	<Keyboard {handleInput} />
{/if}
