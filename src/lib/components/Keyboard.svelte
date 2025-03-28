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
	const defaultTheme = `hg-theme-default hg-layout-default text-secondary-500 fixed bottom-0 !bg-primary-500 text-xl`;

	onMount(() => {
		keyboard = new Keyboard({
			onChange: (input) => handleInput(input),
			theme: defaultTheme,
			layout: {
				default: [
					'q w e r t z u i o p ü',
					'a s d f g h j k l ö ä',
					'{shift} y x c v b n m {backspace}',
					'{space} {ent}'
				]
			},
			buttonTheme: [
				{
					class: '!bg-surface-500',
					buttons:
						'q w e r t z u i o p ü a s d f g h j k l ö ä {shift} y x c v b n m {backspace} {space} {ent}'
				}
			],
			display: {
				'{ent}': 'enter',
				'{backspace}': '⌫',
				'{shift}': '⇧',
				'{space}': '________'
			}
		});
	});
</script>

<div transition:fade={{ duration: 100 }}>
	<div class="simple-keyboard"></div>
</div>
