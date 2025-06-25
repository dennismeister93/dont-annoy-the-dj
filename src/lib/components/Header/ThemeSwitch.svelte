<script lang="ts">
	import { DEFAULT_THEME, PRECONFIGURED_THEMES } from '$lib/themes';
	import { theme } from '$lib/stores/theme';
</script>

<select
	class="select select-bordered"
	onchange={(e) => theme.set((e.target as HTMLSelectElement).value)}
	value={DEFAULT_THEME}
>
	{#each PRECONFIGURED_THEMES as theme}
		<option value={theme}>{theme}</option>
	{/each}
</select>
