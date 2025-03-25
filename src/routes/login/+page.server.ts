import { clientId } from '$env/static/private';
import {
	auth,
	generateCodeChallenge,
	generateCodeVerifier,
	redirectUri,
	refreshAccessToken
} from '$lib/auth.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

const SCOPES =
	'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';

export const load: PageServerLoad = async ({ cookies }) => {
	let accessToken = cookies.get('auth_token');
	const refreshToken = cookies.get('refresh_token');

	if (!accessToken && refreshToken) {
		try {
			console.log('Access token missing, attempting refresh...');
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await refreshAccessToken(refreshToken);

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

			accessToken = newAccessToken;
		} catch (error) {
			console.error('Error refreshing token:', error);
			redirect(302, '/'); // Redirect to login if refreshing fails
		}
	}

	if (!accessToken) {
		console.log('No auth token, requesting new');
		auth.verifier = generateCodeVerifier(128);
		const challenge = await generateCodeChallenge(auth.verifier);
		const params = new URLSearchParams({
			client_id: clientId,
			response_type: 'code',
			redirect_uri: redirectUri,
			scope: SCOPES,
			code_challenge_method: 'S256',
			code_challenge: challenge
		});
		redirect(302, `https://accounts.spotify.com/authorize?${params.toString()}`);
	}
	return { token: accessToken };
};
