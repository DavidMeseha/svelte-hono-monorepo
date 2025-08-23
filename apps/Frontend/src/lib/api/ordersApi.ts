const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Create an order for the logged-in user with a specified delivery address.
 * @param {string} token - Authorization token.
 * @param {string} addressId - ID of the delivery address.
 * @returns {Promise<Object>} - API response containing order details.
 */
export const createOrder = async (token: string, addressId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                addressId
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

/**
 * Fetch orders for the logged-in user.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response with orders.
 */
export const fetchOrders = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};