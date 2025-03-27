import type { RequestHandler } from '@sveltejs/kit';

const queue_endpoint = `https://api.spotify.com/v1/me/player/queue`;

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
}

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return Response.json([]);
	}
	const res = await fetch(queue_endpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (res.status === 204 || res.status > 400) {
		return Response.json([]);
	}

	const responseObj = await res.json();
	const currentlyPlaying = responseObj.currently_playing;
	const queue = responseObj.queue;
	const title = currentlyPlaying.name;
	const artist = currentlyPlaying.artists
		.map((_artist: { name: unknown }) => _artist.name)
		.join(', ');
	const album = currentlyPlaying.album.name;
	const albumImageUrl = currentlyPlaying.album.images[0].url;
	const songUrl = currentlyPlaying.external_urls.spotify;
	const currentlyPlayingRes = {
		title,
		artist,
		album,
		albumImageUrl,
		songUrl
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
