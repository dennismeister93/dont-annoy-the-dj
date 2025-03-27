import { refreshAccessToken } from '$lib/auth.svelte';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('Handle');
	const cookies = event.cookies;
	let accessTokenCookie = cookies.get('access_token');
	const refreshTokenCookie = cookies.get('refresh_token');
	if (!accessTokenCookie && refreshTokenCookie) {
		try {
			console.log('Refreshing access token...');
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await refreshAccessToken(refreshTokenCookie);

			cookies.set('access_token', newAccessToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 3600
			});
			if (newRefreshToken) {
				console.log('Got new refresh token');
				cookies.set('refresh_token', newRefreshToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 30 * 24 * 60 * 60
				});
			}
		} catch (error) {
			console.error('Error refreshing access token:', error);
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
		}
	}
	return resolve(event);
};
