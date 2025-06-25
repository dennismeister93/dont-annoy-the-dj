import { type CookieSerializeOptions } from 'cookie';

export const ACCESS_TOKEN_OPTIONS: CookieSerializeOptions & { path: string } = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	maxAge: 3600 // 1 hour
};

export const REFRESH_TOKEN_OPTIONS: CookieSerializeOptions & { path: string } = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	maxAge: 30 * 24 * 60 * 60 // 30 days
};
