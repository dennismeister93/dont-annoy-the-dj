<script lang="ts">
	import Keyboard from 'simple-keyboard';
	import { onMount } from 'svelte';
	import 'simple-keyboard/build/css/index.css';
	import { fade } from 'svelte/transition';

	interface Props {
		handleInput: (input: string) => void;
	}
	const { handleInput }: Props = $props();
	let keyboard: Keyboard;
	const defaultTheme = `hg-theme-default hg-layout-default text-black fixed bottom-0 left-0`;

	onMount(() => {
		keyboard = new Keyboard({
			onChange: (input) => handleInput(input),
			theme: defaultTheme,
			layout: {
				default: [
					'` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
					'{tab} q w e r t y u i o p [ ] \\',
					"{lock} a s d f g h j k l ; ' {enter}",
					'{shift} z x c v b n m , . / {shift}',
					'.com @ {space}'
				]
			}
		});
	});
</script>

<div transition:fade={{ duration: 100 }}>
	<div class="simple-keyboard text-black"></div>
</div>
