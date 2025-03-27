import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	console.log('Initial check for access & refresh token in cookies');
	const accessToken = cookies.get('access_token');
	console.log(accessToken);
	if (!accessToken) {
		console.log('Redirect to login');
		redirect(302, `/login`);
	}
	redirect(302, '/start');
};
