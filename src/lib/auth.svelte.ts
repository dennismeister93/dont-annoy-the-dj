const clientId = 'dec8529070e64f829372ddafadc95228';
const redirectUri = 'http://localhost:5173/callback';

export const auth: { verifier: string; token: string } = $state({ verifier: '', token: '' });

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

// export async function redirectToAuth() {
// 	const verifier = generateCodeVerifier();
// 	localStorage.setItem('verifier', verifier);

// 	const challenge = await generateCodeChallenge(verifier);

// 	const params = new URLSearchParams({
// 		client_id: clientId,
// 		response_type: 'code',
// 		redirect_uri: redirectUri,
// 		scope: 'user-read-private user-read-email',
// 		code_challenge_method: 'S256',
// 		code_challenge: challenge
// 	});

// 	window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
// }

export async function getAccessToken(code: string) {
	// const verifier = getContext<string>('verifier');
	if (!auth.verifier) throw new Error('No verifier found in storage');

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
