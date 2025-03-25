const add_to_queue_endpoint = 'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A';

export async function addToQueue(token: string, id: string): Promise<void> {
	await fetch(`${add_to_queue_endpoint}${id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}
