import { refreshAccessToken } from '$lib/utils/auth.svelte';
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from '$lib/utils/cookies.svelte';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	if (accessToken || !refreshToken) {
		return resolve(event);
	}

	try {
		const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
			await refreshAccessToken(refreshToken);

		cookies.set('access_token', newAccessToken, ACCESS_TOKEN_OPTIONS);
		if (newRefreshToken) {
			cookies.set('refresh_token', newRefreshToken, REFRESH_TOKEN_OPTIONS);
		}
	} catch (err) {
		console.error('Error refreshing access token:', err instanceof Error ? err.message : err);
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });
	}

	return resolve(event);
};
