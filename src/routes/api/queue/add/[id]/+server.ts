import type { RequestHandler } from '@sveltejs/kit';

const add_to_queue_endpoint = 'https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A';

async function addToQueue(token: string, id: string): Promise<void> {
	await fetch(`${add_to_queue_endpoint}${id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

export const POST: RequestHandler = async ({ cookies, params: { id } }) => {
	const accessToken = cookies.get('access_token');
	if (!id || !accessToken) {
		return Response.json([]);
	}
	await addToQueue(accessToken, id);
	return Response.json([]);
};
