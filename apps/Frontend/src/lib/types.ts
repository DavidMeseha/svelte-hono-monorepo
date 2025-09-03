export interface PaginatedResponse<T> {
	products: T[];
	metadata: {
		total: number;
		page: number;
		pages: number;
	};
	success: boolean;
}

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

export type CartItem = {
	cartId: string;
	id: string;
	product: Product;
	productId: string;
	quantity: number;
};

export type Summary = {
	subTotal: number;
	tax: number;
	shipping: number;
	total: number;
	totalItems: number;
};

export type CartItemsResponse = {
	success: boolean;
	items: CartItem[];
	summary: Summary;
};

export type ProductsResponse = PaginatedResponse<Product>;

export type Category = {
	_id: string;
	name: string;
};

export type UserDetailsResponse = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export interface Address {
	id: string;
	address_line_1: string;
	city: string;
	state: string;
	zipcode: string;
	is_default: boolean;
}
