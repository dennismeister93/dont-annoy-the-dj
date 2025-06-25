import { SPOTIFY_API_URL } from '$lib/constants';
import type { RequestHandler } from '@sveltejs/kit';

const ADD_TO_QUEUE_ENDPOINT = `${SPOTIFY_API_URL}/v1/me/player/queue?uri=spotify%3Atrack%3A`;

async function addToQueue(token: string, id: string): Promise<void> {
	await fetch(`${ADD_TO_QUEUE_ENDPOINT}${id}`, {
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
