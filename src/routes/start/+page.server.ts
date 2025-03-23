import { auth } from '$lib/auth.svelte';
import type { PageServerLoad } from './$types';

export interface UserProfile {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: { spotify: string };
	followers: { href: string; total: number };
	href: string;
	id: string;
	images: Image[];
	product: string;
	type: string;
	uri: string;
}

interface Image {
	url: string;
	height: number;
	width: number;
}

export const load: PageServerLoad = async ({ cookies }) => {
	console.log(cookies.get('auth_token'));
	const profile = await fetchProfile(auth.token);
	const token = auth.token;
	return { profile, token };
};

async function fetchProfile(token: string): Promise<UserProfile> {
	const res = await fetch('https://api.spotify.com/v1/me', {
		headers: { Authorization: `Bearer ${token}` }
	});
	return await res.json();
}
