import type { RequestHandler } from '@sveltejs/kit';
import type { Image } from '../../queue/+server';

const search_endpoint = 'https://api.spotify.com/v1/search?';

export interface SearchTrackInformation {
	id: string;
	track: string;
	artists: string;
	image: Image;
}

export const GET: RequestHandler = async ({ cookies, params: { searchValue } }) => {
	if (!searchValue) {
		return Response.json([]);
	}
	const params = new URLSearchParams({
		q: searchValue,
		type: 'artist,track',
		market: 'DE'
	});

	const url = `${search_endpoint}${params.toString()}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`
		}
	});

	if (res.status === 204 || res.status > 400) {
		return Response.json([]);
	}

	const responseObj = await res.json();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tracks: any[] = responseObj.tracks.items;

	const formattedTracks = tracks.map((item) => {
		console.log(item.artists.map((_artist: { name: unknown }) => _artist.name).join(', '));
		return {
			id: item.id,
			track: item.name,
			artists: item.artists.map((_artist: { name: unknown }) => _artist.name).join(', '),
			image: item.album.images[0]
		};
	});
	return Response.json(formattedTracks);
};
