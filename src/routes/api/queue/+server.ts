import type { RequestHandler } from '@sveltejs/kit';

const queue_endpoint = `https://api.spotify.com/v1/me/player/queue`;
const currently_playing_endpoint = 'https://api.spotify.com/v1/me/player/currently-playing';
export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface TrackInformation {
	id: string;
	image: Image;
	track: string;
	artist: string;
	progress?: { duration: number; timeLeft: number };
}

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return Response.json([]);
	}
	const queueResponse = await fetch(queue_endpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const currentlyPlayingResponse = await fetch(currently_playing_endpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (queueResponse.status === 204 || queueResponse.status > 400) {
		return Response.json([]);
	}

	const queueData = await queueResponse.json();
	const currentlyData = await currentlyPlayingResponse.json();
	const currentlyPlaying = queueData.currently_playing;
	const queue = queueData.queue;
	const title = currentlyPlaying.name;
	const artist = currentlyPlaying.artists
		.map((_artist: { name: unknown }) => _artist.name)
		.join(', ');
	const albumImage = currentlyPlaying.album.images[0];
	const currentlyPlayingRes: TrackInformation = {
		id: currentlyPlaying.id,
		image: albumImage,
		track: title,
		artist,
		progress: { duration: currentlyData.item.duration_ms, timeLeft: currentlyData.progress_ms }
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const nextTracksRes: TrackInformation[] = queue.map((item: any) => {
		return {
			id: item.id,
			image: item.album.images[0],
			track: item.name,
			artist: item.artists[0].name
		};
	});
	return Response.json({ currentlyPlayingRes, nextTracksRes });
};
