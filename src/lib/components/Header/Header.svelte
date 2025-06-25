<script lang="ts">
	import type { UserProfile } from '$lib/types';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import Anchor from './Anchor.svelte';
	import ProfileInfo from './ProfileInfo.svelte';
	interface Props {
		profile: UserProfile;
	}
	let { profile }: Props = $props();
</script>

<header
	class="bg-surface-600 flex flex-wrap items-center justify-between p-2 text-xs text-white shadow-sm"
>
	<ProfileInfo {profile} />

	<div class="flex flex-row items-center gap-3">
		<Anchor href={profile.uri} text="Spotify" />
		<Anchor href={profile.external_urls.spotify} text="Profile" />
		<ThemeSwitch />
	</div>
</header>
