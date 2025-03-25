<script lang="ts">
	import SearchArea from '$lib/components/SearchArea.svelte';
	import Input from '$lib/components/SearchArea.svelte';
	import UserData from '$lib/components/UserData.svelte';
	import NowPlaying from '../../lib/components/NowPlaying.svelte';
	import type { PageProps } from '../start/$types';
	let { data }: PageProps = $props();
</script>

{#if data.profile}
	<!-- <section class="bg-surface-500 grid grid-rows-[auto_1fr_auto] space-y-4 p-4"> -->
	<section class="bg-surface-500 grid grid-flow-col grid-rows-3 gap-4">
		<!-- <UserData profile={data.profile} /> -->
		<div class="row-span-3">
			<NowPlaying token={data.token}></NowPlaying>
		</div>
		<!-- <div class="col-span-2">02</div> -->
		<SearchArea token={data.token} />
	</section>
{/if}
