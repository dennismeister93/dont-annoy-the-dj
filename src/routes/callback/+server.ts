import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAccessToken } from '$lib/utils/auth.svelte';
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from '$lib/utils/cookies.svelte';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		redirect(302, '/');
	}
	try {
		const { accessToken, refreshToken } = await getAccessToken(code);
		cookies.set('access_token', accessToken, ACCESS_TOKEN_OPTIONS);
		cookies.set('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
	} catch (error) {
		console.error('Error getting access token:', error);
		redirect(302, '/');
	}
	redirect(302, '/dj');
};
