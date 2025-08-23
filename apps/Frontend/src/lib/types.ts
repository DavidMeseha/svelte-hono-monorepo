export type Product = {
	id: string;
	name: string;
	seName: string;
	description: string;
	price: number;
	stock: number;
	category: { id: string; name: string };
	image: string;
	ratings: {
		id: string;
		product: string;
		rating: number;
		comments: string;
		user: string;
		createdAt: string;
		updatedAt: string;
	}[];
	avgRating: number;
	totalRatings: number;
};

export type ProductResponse = {
	products: Product[];
	metadata: {
		total: number;
		page: number;
		pages: number;
	};
	success: boolean;
};

export type Category = {
	_id: string;
	name: string;
};

export type UserResponse = {
	id: string;
	email: string;
	name: string;
	isLocked: boolean;
	lastLogin: string | null;
	isVerified: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
	refreshToken: string;
	failedAttempts: number;
	lockUntil: string | null;
};
