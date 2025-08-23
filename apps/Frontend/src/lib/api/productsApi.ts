import type { ProductResponse, Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch products with pagination, sorting, and optional query parameters.
 * @param {Object} params - Parameters for the API request.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - Number of products per page.
 * @param {string} params.sort - Sorting field (e.g., 'price', 'name').
 * @param {string} [params.category] - Category ID to filter products.
 * @param {number} [params.minPrice] - Minimum price filter.
 * @param {number} [params.maxPrice] - Maximum price filter.
 * @param {string} [params.search] - Search term to filter by name or description.
 * @returns {Promise<ProductResponse>} - The response containing products and metadata.
 */
export const fetchProducts = async ({
	page = 1,
	limit = 20,
	sort = 'name',
	category,
	minPrice,
	maxPrice,
	search
}: {
	page?: number;
	limit?: number;
	sort?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	search?: string;
}): Promise<ProductResponse> => {
	try {
		// Construct query parameters
		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			sort
		});

		if (category) queryParams.append('category', category);
		if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
		if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
		if (search) queryParams.append('search', search);

		// Fetch data from the API
		const response = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		// Check for valid response
		if (!response.ok) {
			throw new Error(`Failed to fetch products: HTTP ${response.status}`);
		}

		// Parse and return JSON response
		return (await response.json()) as ProductResponse;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
};

/**
 * Fetch product details by ID.
 * @param {string} seName - The product seName.
 * @returns {Promise<Product>} - The product details.
 */
export const fetchProductDetails = async (seName: string): Promise<Product> => {
	try {
		const response = await fetch(`${API_BASE_URL}/api/products/${seName}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		// Check for valid response
		if (!response.ok) {
			throw new Error(`Failed to fetch product details: HTTP ${response.status}`);
		}

		// Parse and return JSON response
		const data = await response.json();
		if (!data.success) {
			throw new Error('Product not found.');
		}

		return data.product as Product;
	} catch (error) {
		console.error('Error fetching product details:', error);
		throw error;
	}
};
