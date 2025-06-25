<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	const handleTheme = theme.subscribe((value) => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', value);
		}
	});

	onMount(() => {
		return () => handleTheme();
	});
</script>

{@render children()}
