const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Create a rating for a product.
 * @param {string} productId - ID of the product to rate.
 * @param {number} rating - The rating score (e.g., 1-5).
 * @param {string} comments - Comments about the product.
 * @param {string} token - Authorization token of the logged-in user.
 * @returns {Promise<Object>} - API response containing the created rating and updated product stats.
 */
export const createRating = async (
    productId: string,
    rating: number,
    comments: string,
    token: string
): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/ratings/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rating, comments }),
        });

        // Handle non-OK responses with detailed error information
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Server Error:', errorResponse);
            throw new Error(
                `Failed to create rating: ${errorResponse.message || response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating rating:', error);
        throw error;
    }
};
