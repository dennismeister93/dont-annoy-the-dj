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
	try {
		console.log('YES, received code');
		const { accessToken, refreshToken } = await getAccessToken(code);
		cookies.set('access_token', accessToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 3600
		});
		cookies.set('refresh_token', refreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});
	} catch (error) {
		console.error('Error getting access token:', error);
		redirect(302, '/');
	}
	console.log('Redirecting to start');
	redirect(302, '/start');
};
