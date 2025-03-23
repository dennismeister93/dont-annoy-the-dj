<script lang="ts">
	import NowPlaying from '../../lib/components/NowPlaying.svelte';
	import type { PageProps } from '../start/$types';
	let { data }: PageProps = $props();
</script>

{#if data.profile}
	<section class="grid h-screen grid-rows-[auto_1fr_auto]">
		<header class="bg-surface-600 p-4">
			Logged in as <span>{data.profile.display_name}</span>
			<span id="avatar"></span>
		</header>
		<main class="bg-surface-500 space-y-4 p-4">
			<p class="bg-surface-400 p-4">User ID: <span id="id">{data.profile.id}</span></p>
			<p class="bg-surface-400 p-4">Email: <span id="email">{data.profile.email}</span></p>
			<p class="bg-surface-400 p-4">
				Spotify URI: <a id="uri" href={data.profile.uri}>{data.profile.uri}</a>
			</p>
			<p class="bg-surface-400 p-4">
				Link: <a id="url" href={data.profile.external_urls.spotify}
					>{data.profile.external_urls.spotify}</a
				>
			</p>
			<NowPlaying token={data.token}></NowPlaying>
		</main>
	</section>
{/if}
