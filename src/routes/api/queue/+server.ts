import { SPOTIFY_API_URL } from '$lib/constants';
import type { TrackInformation } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

const QUEUE_ENDPOINT = `${SPOTIFY_API_URL}/v1/me/player/queue`;
const CURRENTLY_PLAYING_ENDPOINT = `${SPOTIFY_API_URL}/v1/me/player/currently-playing`;

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return new Response(JSON.stringify({ error: 'No access token' }), { status: 401 });
	}

	try {
		const [queueResponse, currentlyPlayingResponse] = await Promise.all([
			fetch(QUEUE_ENDPOINT, { headers: { Authorization: `Bearer ${accessToken}` } }),
			fetch(CURRENTLY_PLAYING_ENDPOINT, { headers: { Authorization: `Bearer ${accessToken}` } })
		]);

		if (!queueResponse.ok) {
			return new Response(JSON.stringify({ error: 'Failed to fetch queue' }), {
				status: queueResponse.status
			});
		}

		if (!currentlyPlayingResponse.ok) {
			return new Response(JSON.stringify({ error: 'Failed to fetch currently playing' }), {
				status: currentlyPlayingResponse.status
			});
		}

		let queueData;
		let currentlyData;

		try {
			queueData = await queueResponse.json();
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid queue JSON response' }));
		}

		try {
			currentlyData = await currentlyPlayingResponse.json();
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid currently playing JSON response' }));
		}

		const currentlyPlaying = queueData.currently_playing;

		if (!currentlyPlaying) {
			return new Response(JSON.stringify({ error: 'No track currently playing' }), { status: 204 });
		}

		const title = currentlyPlaying.name ?? 'Unknown Title';
		const artist =
			currentlyPlaying.artists?.map((a: { name: string }) => a.name).join(', ') ?? 'Unknown Artist';
		const albumImage = currentlyPlaying.album?.images?.[0] ?? { url: '', height: 0, width: 0 };

		const currentlyPlayingRes: TrackInformation = {
			id: currentlyPlaying.id,
			image: albumImage,
			track: title,
			artist,
			progress: {
				duration: currentlyData?.item?.duration_ms ?? 0,
				timeLeft: currentlyData?.progress_ms ?? 0,
				isPlaying: currentlyData?.is_playing ?? false
			}
		};

		const nextTracksRes: TrackInformation[] = Array.isArray(queueData.queue)
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				queueData.queue.map((item: any) => ({
					id: item.id,
					image: item.album?.images?.[0] ?? { url: '', height: 0, width: 0 },
					track: item.name ?? 'Unknown Track',
					artist: item.artists?.[0]?.name ?? 'Unknown Artist'
				}))
			: [];

		return new Response(JSON.stringify({ currentlyPlayingRes, nextTracksRes }), { status: 200 });
	} catch (error) {
		console.error('Error fetching Spotify data:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				currentlyPlayingRes: null,
				nextTracksRes: []
			}),
			{
				status: 500
			}
		);
	}
};
