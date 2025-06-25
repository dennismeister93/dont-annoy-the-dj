import { DEFAULT_THEME } from '$lib/themes';
import { writable } from 'svelte/store';

export const theme = writable(DEFAULT_THEME);
