<script lang="ts">
	import SearchArea from '$lib/components/SearchArea/SearchArea.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import NowPlaying from '../../lib/components/NowPlaying/NowPlaying.svelte';
	import type { PageProps } from '../dj/$types';
	let { data }: PageProps = $props();
</script>

{#if data.profile}
	<Header profile={data.profile} />
	<section class="bg-surface-500 grid min-h-screen grid-cols-2 gap-4">
		<NowPlaying />
		<SearchArea />
	</section>
{/if}
