import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAccessToken } from '$lib/auth.svelte';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('Get');
	const code = url.searchParams.get('code');

	if (!code) {
		console.log('Error');
		redirect(302, '/');
	}
	let token: string;
	try {
		console.log('YES, received code');
		token = await getAccessToken(code);
		cookies.set('auth_token', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 7200
		});
	} catch (error) {
		console.error('Error getting access token:', error);
		redirect(302, '/');
	}
	console.log('Redirecting to start');
	redirect(302, '/start');
};
