<script lang="ts">
	import type { TrackInformation, TrackDisplayVariant } from '$lib/types';
	import { onDestroy } from 'svelte';

	interface Props {
		track: TrackInformation;
		handleAdd?: (trackId: string) => void;
		variant?: TrackDisplayVariant;
	}

	const { track, handleAdd, variant = 'search' }: Props = $props();

	const variantStyles = {
		playing: {
			bg: 'bg-surface-200 dark:bg-surface-800 ',
			text: 'text-primary-600 dark:text-primary-300',
			textSong: 'text-secondary-700 dark:text-secondary-400',
			icon: '🔊',
			animate: 'animate-spin-slow'
		},
		queue: {
			bg: 'bg-surface-200 dark:bg-surface-800 ',
			text: 'text-primary-600 dark:text-primary-300',
			textSong: 'text-secondary-700 dark:text-secondary-400',
			icon: '🎵',
			animate: 'animate-wibble-slow'
		},
		search: {
			bg: 'bg-surface-200 dark:bg-surface-800 ',
			text: 'text-primary-600 dark:text-primary-300',
			textSong: 'text-secondary-700 dark:text-secondary-400',
			icon: '🔍',
			animate: ''
		}
	};
	const shadowClasses = 'shadow-sm shadow-secondary-500 hover:shadow-md ';

	function getTotalTime(duration_ms: number) {
		const minutes = Math.floor(duration_ms / 60000);
		const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, '0')}`;
	}

	function getProgressedTime(ms: number) {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	let progressedTime: number = $state(track.progress?.timeLeft || 0);
	let interval: number | null = null;

	function startProgressUpdater() {
		if (interval) clearInterval(interval);

		interval = setInterval(() => {
			progressedTime += 1000;
		}, 1000);
	}

	$effect(() => {
		if (track.progress) {
			progressedTime = track.progress.timeLeft;
			startProgressUpdater();
		} else {
			if (interval) clearInterval(interval);
		}
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div class="p-1">
	<div
		class="card flex items-center gap-3 rounded-md p-2 transition-all duration-200 active:scale-95 {shadowClasses} {variantStyles[
			variant
		].bg}"
	>
		<img src={track.image.url} alt={track.artist} class="h-16 w-16 rounded-md object-cover" />

		<div class="min-w-0 flex-1">
			<h2 class="truncate text-xl font-bold {variantStyles[variant].text}">
				{track.artist}
			</h2>
			<h3 class="truncate text-lg {variantStyles[variant].textSong}">
				<span class={variantStyles[variant].animate}>{variantStyles[variant].icon}</span>
				{track.track}
				{#if track.progress}
					<span class="ml-auto text-sm text-gray-500">
						{getProgressedTime(progressedTime)} / {getTotalTime(track.progress.duration)}
					</span>
				{/if}
			</h3>
			{#if track.progress}
				<div class="mt-1 h-2 w-full rounded-full bg-gray-300 dark:bg-gray-700">
					<div
						class="bg-primary-500 h-2 rounded-full transition-all duration-100"
						style="width: {Math.min((progressedTime / track.progress.duration) * 100, 100)}%;"
					></div>
				</div>
			{/if}
		</div>

		{#if handleAdd && variant !== 'playing'}
			<button
				type="button"
				class="btn preset-filled bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-400 dark:hover:bg-secondary-500 relative flex items-center justify-center overflow-hidden transition-transform duration-200"
				onclick={() => handleAdd(track.id)}
			>
				<span class="text-lg">Queue!</span>
			</button>
		{/if}
	</div>
</div>

<style>
	@keyframes ripple {
		0% {
			transform: scale(0);
			opacity: 0.6;
		}
		100% {
			transform: scale(2.5);
			opacity: 0;
		}
	}
	.animate-ripple {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		animation: ripple 0.6s ease-out;
	}

	@keyframes spin-slow {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.animate-spin-slow {
		display: inline-block;
		animation: spin-slow 3s linear infinite;
	}

	@keyframes wibble {
		0% {
			transform: translate(5px);
		}
		100% {
			transform: translate(0px);
		}
	}

	.animate-wibble-slow {
		display: inline-block;
		animation: wibble 0.5s linear infinite alternate;
	}
</style>
