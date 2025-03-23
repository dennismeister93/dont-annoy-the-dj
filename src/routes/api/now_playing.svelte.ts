const now_playing_endpoint = `https://api.spotify.com/v1/me/player/currently-playing`;

export async function nowPlaying(token: string) {
	const res = await fetch(now_playing_endpoint, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (res.status === 204 || res.status > 400) {
		return { body: { isPlaying: false } };
	}

	const song = await res.json();

	const isPlaying = song.is_playing;
	const title = song.item.name;
	const artist = song.item.artists.map((_artist: { name: unknown }) => _artist.name).join(', ');
	const album = song.item.album.name;
	const albumImageUrl = song.item.album.images[0].url;
	const songUrl = song.item.external_urls.spotify;

	return {
		title,
		artist,
		album,
		isPlaying,
		albumImageUrl,
		songUrl
	};
}
