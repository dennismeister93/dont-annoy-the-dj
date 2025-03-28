<script lang="ts">
	import { onMount } from 'svelte';
	import Track, { type Variant } from './Track.svelte';
	import type { TrackInformation } from '../../../routes/api/queue/+server';

	interface Props {
		tracks: TrackInformation[];
		variant: Variant;
		handleAdd?: (trackId: string) => void;
	}
	const { tracks, variant, handleAdd }: Props = $props();

	let nextTracksContainer: HTMLDivElement,
		isDragging = false,
		startX: number,
		startY: number,
		scrollLeft: number,
		scrollTop: number,
		velocityX = 0,
		velocityY = 0,
		momentumID: number;

	const applyMomentum = () => {
		if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
			nextTracksContainer.scrollBy(velocityX, velocityY);
			velocityX *= 0.95; // Reduce speed gradually
			velocityY *= 0.95;
			momentumID = requestAnimationFrame(applyMomentum);
		} else {
			cancelAnimationFrame(momentumID);
		}
	};

	onMount(() => {
		if (!nextTracksContainer) return;

		nextTracksContainer.addEventListener('mousedown', (e) => {
			isDragging = true;
			startX = e.pageX;
			startY = e.pageY;
			scrollLeft = nextTracksContainer.scrollLeft;
			scrollTop = nextTracksContainer.scrollTop;
			nextTracksContainer.style.cursor = 'grabbing';

			// Cancel momentum on new drag
			cancelAnimationFrame(momentumID);
			velocityX = 0;
			velocityY = 0;
		});

		nextTracksContainer.addEventListener('mousemove', (e) => {
			if (!isDragging) return;

			e.preventDefault(); // Prevents text selection
			let deltaX = e.pageX - startX;
			let deltaY = e.pageY - startY;

			// Update scroll position of div
			nextTracksContainer.scrollLeft = scrollLeft - deltaX;
			nextTracksContainer.scrollTop = scrollTop - deltaY;

			// Store velocity for momentum
			velocityX = -deltaX * 0.3;
			velocityY = -deltaY * 0.3;
		});

		nextTracksContainer.addEventListener('mouseup', () => {
			isDragging = false;
			nextTracksContainer.style.cursor = 'default';

			// Apply smooth momentum scrolling
			requestAnimationFrame(applyMomentum);
		});
	});
</script>

<div bind:this={nextTracksContainer} class="max-h-full flex-1 overflow-auto">
	{#each tracks as track}
		<Track {track} {variant} {handleAdd} />
	{/each}
</div>
