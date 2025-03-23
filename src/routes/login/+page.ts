import { redirect } from '@sveltejs/kit';
import { auth, generateCodeChallenge, generateCodeVerifier } from '$lib/auth.svelte';
import type { PageLoad } from './$types';

const clientId = 'dec8529070e64f829372ddafadc95228';

export const load: PageLoad = async () => {
	if (!auth.token) {
		console.log('No auth token, requesting new');
		const verifier = generateCodeVerifier(128);
		auth.verifier = verifier;
		const challenge = await generateCodeChallenge(verifier);
		const params = new URLSearchParams();
		params.append('client_id', clientId);
		params.append('response_type', 'code');
		params.append('redirect_uri', 'http://localhost:5173/callback');
		params.append('scope', 'user-read-private user-read-email user-read-currently-playing');
		params.append('code_challenge_method', 'S256');
		params.append('code_challenge', challenge);
		throw redirect(302, `https://accounts.spotify.com/authorize?${params.toString()}`);
	}

	try {
		console.log('JUUUHUUUUU returning auth token');
		return { token: auth.token };
	} catch (error) {
		console.error('Error fetching access token:', error);
		throw redirect(302, '/');
	}
};
