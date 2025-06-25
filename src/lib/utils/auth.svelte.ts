import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';

export const spotifyUrl = 'https://accounts.spotify.com';
export const spotifyTokenEndpoint = '/api/token';
export const spotifyAuthEndpoint = '/authorize';

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
		client_id: CLIENT_ID,
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI,
		code_verifier: auth.verifier
	});

	const response = await fetch(`${spotifyUrl}${spotifyTokenEndpoint}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});

	const data = await response.json();
	return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

export async function refreshAccessToken(refreshToken: string) {
	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	});

	const response = await fetch(`${spotifyUrl}${spotifyTokenEndpoint}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(`Failed to refresh token: ${data.error}`);
	}

	return { accessToken: data.access_token, refreshToken: data.refresh_token || refreshToken };
}
