import { clientId } from '$env/static/private';

export const redirectUri = 'http://localhost:5173/callback';
export const auth: { verifier: string } = $state({ verifier: '' });

export function generateCodeVerifier(length = 128) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export async function generateCodeChallenge(codeVerifier: string) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function getAccessToken(code: string) {
	const params = new URLSearchParams({
		client_id: clientId,
		grant_type: 'authorization_code',
		code,
		redirect_uri: redirectUri,
		code_verifier: auth.verifier
	});

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});

	const data = await response.json();
	return data.access_token;
}
