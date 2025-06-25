<script lang="ts">
	import type { UserProfile } from '$lib/types';
	interface Props {
		profile: UserProfile;
	}
	let { profile }: Props = $props();
</script>

<div class="flex items-center gap-2">
	{#if profile.images?.[0]?.url}
		<img src={profile.images[0].url} alt="ProfileImage" class="h-7 w-7 rounded-full" />
	{/if}
	<span class="max-w-[16rem]">Logged In: {profile.display_name}</span>
</div>
