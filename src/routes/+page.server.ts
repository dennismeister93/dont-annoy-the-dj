import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Initial check for access & refresh token in cookies
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		redirect(302, `/login`);
	}
	redirect(302, '/dj');
};
