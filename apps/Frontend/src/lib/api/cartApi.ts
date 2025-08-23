const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Add an item to the cart.
 * @param {Object} params - Item details.
 * @param {string} params.productId - The ID of the product to add.
 * @param {number} params.quantity - The quantity of the product to add.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response.
 */
export const addToCart = async ({ productId, quantity }: { productId: string; quantity: number }, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/add-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add item to cart: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
};

/**
 * Fetch cart items for the logged-in user.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response containing cart details.
 */
export const fetchCartItems = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch cart items: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};


/**
 * Update an item in the cart.
 * @param {Object} params - Item details.
 * @param {string} params.itemId - The ID of the cart item to update.
 * @param {number} params.quantity - The new quantity for the cart item.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response.
 */
export const updateCartItem = async ({ itemId, quantity }: { itemId: string; quantity: number }, token: string) => {
    console.log(itemId, quantity)
    try {
        const response = await fetch(`${API_BASE_URL}/cart/update-item`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ item_id: itemId, quantity }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update cart item: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

/**
 * Delete an item from the cart.
 * @param {string} itemId - The ID of the cart item to delete.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response.
 */
export const deleteCartItem = async (itemId: string, token: string) => {

    console.log(itemId, token)

    try {
        const response = await fetch(`${API_BASE_URL}/cart/remove-item/${itemId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        console.log(response)

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete cart item: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting cart item:', error);
        throw error;
    }
};

/**
 * Clear the entire cart.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response.
 */
export const clearCart = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to clear cart: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

