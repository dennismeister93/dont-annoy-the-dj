import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';
import {
	auth,
	generateCodeChallenge,
	generateCodeVerifier,
	refreshAccessToken,
	spotifyAuthEndpoint,
	spotifyUrl
} from '$lib/utils/auth.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from '$lib/utils/cookies.svelte';

const SCOPES =
	'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state';

export const load: PageServerLoad = async ({ cookies }) => {
	// Checking for access & refresh token in cookies
	let accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	if (!accessToken && refreshToken) {
		try {
			console.log('Access token missing, attempting refresh...');
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await refreshAccessToken(refreshToken);

			cookies.set('access_token', newAccessToken, ACCESS_TOKEN_OPTIONS);
			cookies.set('refresh_token', newRefreshToken, REFRESH_TOKEN_OPTIONS);
			accessToken = newAccessToken;
		} catch (error) {
			console.error('Error refreshing token:', error);
			redirect(302, '/');
		}
	}

	if (!accessToken) {
		// No access token found, requesting new
		auth.verifier = generateCodeVerifier(128);
		const challenge = await generateCodeChallenge(auth.verifier);
		const params = new URLSearchParams({
			client_id: CLIENT_ID,
			response_type: 'code',
			redirect_uri: REDIRECT_URI,
			scope: SCOPES,
			code_challenge_method: 'S256',
			code_challenge: challenge
		});
		redirect(302, `${spotifyUrl}${spotifyAuthEndpoint}?${params.toString()}`);
	}
	return { token: accessToken };
};
