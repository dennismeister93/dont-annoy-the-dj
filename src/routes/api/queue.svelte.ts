/* eslint-disable @typescript-eslint/no-explicit-any */
const queue_endpoint = `https://api.spotify.com/v1/me/player/queue`;

interface Image {
	height: number;
	url: string;
	width: number;
}

export interface TrackInformation {
	image: Image;
	track: string;
	artist: string;
}

export async function getQueue(token: string) {
	const res = await fetch(queue_endpoint, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (res.status === 204 || res.status > 400) {
		return [];
	}

	const responseObj = await res.json();
	// const currentlyPlaying = responseObj.currently_playing;
	const queue = responseObj.queue;

	const nextTracks: TrackInformation[] = queue.map((item: any) => {
		return { image: item.album.images[0], track: item.name, artist: item.artists[0].name };
	});
	return nextTracks;
}
