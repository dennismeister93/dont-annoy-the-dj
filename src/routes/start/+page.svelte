<script lang="ts">
	import SearchArea from '$lib/components/SearchArea.svelte';
	import NowPlaying from '../../lib/components/NowPlaying.svelte';
	import type { PageProps } from '../start/$types';
	let { data }: PageProps = $props();
</script>

{#if data.profile}
	<section class="bg-surface-500 grid min-h-screen grid-cols-2 gap-4">
		<!-- <UserData profile={data.profile} /> -->
		<NowPlaying />
		<SearchArea />
	</section>
{/if}
