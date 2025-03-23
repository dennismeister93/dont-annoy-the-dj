import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	if (!auth.token) {
		throw redirect(302, `/login`);
	} else {
		throw redirect(302, '/start');
	}
};
