import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_API_URL } from '$lib/constants';
import type { TrackInformation } from '$lib/types';

const SEARCH_ENDPOINT = `${SPOTIFY_API_URL}/v1/search`;

export const GET: RequestHandler = async ({ cookies, params: { searchValue } }) => {
	if (!searchValue) {
		return new Response(JSON.stringify([]), { status: 400 });
	}

	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return new Response(JSON.stringify({ error: 'No access token' }), { status: 401 });
	}

	const params = new URLSearchParams({
		q: searchValue,
		type: 'artist,track',
		limit: '50',
		market: 'DE'
	});

	const url = `${SEARCH_ENDPOINT}?${params.toString()}`;

	try {
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!res.ok) {
			return new Response(JSON.stringify([]), { status: res.status });
		}

		const responseObj = await res.json();
		const tracks = responseObj.tracks?.items ?? [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const formattedTracks: TrackInformation[] = tracks.map((item: any) => ({
			id: item.id,
			track: item.name ?? 'Unknown Track',
			artist: item.artists?.map((a: { name: string }) => a.name).join(', ') ?? 'Unknown Artist',
			image: item.album?.images?.[0] ?? { url: '', width: 0, height: 0 }
		}));

		return new Response(JSON.stringify(formattedTracks), { status: 200 });
	} catch (error) {
		console.error('Error fetching Spotify search results:', error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
};
