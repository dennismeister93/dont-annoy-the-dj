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

export interface Image {
	url: string;
	height: number;
	width: number;
}

export interface TrackInformation {
	id: string;
	image: Image;
	track: string;
	artist: string;
	progress?: { duration: number; timeLeft: number; isPlaying: boolean };
}

export type TrackDisplayVariant = 'playing' | 'queue' | 'search';
