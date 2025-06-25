import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserProfile } from '$lib/types';
import { SPOTIFY_API_URL } from '$lib/constants';

const PROFILE_DATA_ENDPOINT = `${SPOTIFY_API_URL}/v1/me`;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	if (!token) {
		error(401, 'Please authorize. Visit "/"');
	}
	const profile = await fetchProfile(token);
	return { profile };
};

async function fetchProfile(token: string): Promise<UserProfile> {
	const res = await fetch(PROFILE_DATA_ENDPOINT, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return await res.json();
}
