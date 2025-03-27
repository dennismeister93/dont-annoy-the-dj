<script lang="ts">
	import type { TrackInformation } from '../../../routes/api/queue/+server';

	interface Props {
		track: TrackInformation;
		handleAdd?: (trackId: string) => {};
	}

	const { track, handleAdd }: Props = $props();

	const shadowClasses = 'shadow-md shadow-secondary-500 ring-1';
</script>

<div class="content-center p-1">
	<div
		class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block w-full divide-y overflow-hidden border-[1px] {shadowClasses}"
	>
		<header>
			<img src={track.image.url} alt={track.artist} class="aspect-[21/7] w-full" />
		</header>
		<article class="space-y-4 p-4">
			<div>
				<div class="flex flex-row">
					<div class="flex w-3/4 flex-col text-center">
						<h2 class="h6 underline">{track.artist}</h2>
						<h3 class="h5 italic">Song: {track.track}</h3>
					</div>
					<div class=" w-1/4 content-center">
						{#if handleAdd}
							<button type="button" class="btn preset-filled" onclick={() => handleAdd(track.id)}>
								<span>Einreihen!</span>
								<span>&rarr;</span>
							</button>
						{/if}
					</div>
				</div>
			</div>
		</article>
	</div>
</div>
