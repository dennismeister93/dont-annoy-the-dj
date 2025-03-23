import type { PageServerLoad } from './start/$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');
	return { token };
};
