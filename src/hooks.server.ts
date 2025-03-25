import { refreshAccessToken } from '$lib/auth.svelte';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	let accessTokenCookie = cookies.get('auth_token');
	const refreshTokenCookie = cookies.get('refresh_token');
	if (!accessTokenCookie && refreshTokenCookie) {
		try {
			console.log('Refreshing access token...');
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await refreshAccessToken(refreshTokenCookie);

			cookies.set('auth_token', newAccessToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 3600
			});
			cookies.set('refresh_token', newRefreshToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 30 * 24 * 60 * 60
			});

			accessTokenCookie = newAccessToken;
		} catch (error) {
			console.error('Error refreshing access token:', error);
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
		}
	}
	return resolve(event);
};
