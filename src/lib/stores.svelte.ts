import { writable } from 'svelte/store';

export const authStore = writable<{ token: string | null }>({
	token: null
});

class Profile {
	stats: unknown = $state(null);
}
export const profile = new Profile();
