<script lang="ts">
	import NowPlaying from '../../lib/components/NowPlaying.svelte';
	import type { UserProfile } from '../../routes/start/+page.server';
	interface Props {
		profile: UserProfile;
	}
	let { profile }: Props = $props();
</script>

<header class="bg-surface-600 p-4">
	Logged in as <span>{profile.display_name}</span>
	<span id="avatar"></span>
</header>
<main>
	<p class="bg-surface-400 p-4">User ID: <span id="id">{profile.id}</span></p>
	<p class="bg-surface-400 p-4">Email: <span id="email">{profile.email}</span></p>
	<p class="bg-surface-400 p-4">
		Spotify URI: <a id="uri" href={profile.uri}>{profile.uri}</a>
	</p>
	<p class="bg-surface-400 p-4">
		Link: <a id="url" href={profile.external_urls.spotify}>{profile.external_urls.spotify}</a>
	</p>
</main>
