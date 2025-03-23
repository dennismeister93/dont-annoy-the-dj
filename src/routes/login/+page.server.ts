import { clientId } from '$env/static/private';
import { auth, generateCodeChallenge, generateCodeVerifier, redirectUri } from '$lib/auth.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

const SCOPES =
	'user-read-private user-read-email user-read-currently-playing user-read-playback-state';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');

	if (!token) {
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

	return { token };
};
