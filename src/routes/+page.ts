import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './login/$types';

export const load: PageLoad = async ({ data }) => {
	const { token } = data;
	if (!token) {
		redirect(302, `/login`);
	} else {
		redirect(302, '/start');
	}
};
