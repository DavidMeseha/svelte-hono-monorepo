const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Make a payment for an order.
 * @param {Object} params - Payment details.
 * @param {string} params.orderId - Order ID.
 * @param {string} params.paymentMethod - Payment method (e.g., "credit_card").
 * @param {number} params.amount - Payment amount.
 * @param {string} params.transactionId - Transaction ID.
 * @param {string} token - Authorization token.
 * @returns {Promise<Object>} - API response.
 */
export const makePayment = async (
    { orderId, paymentMethod, amount, transactionId }: { orderId: string; paymentMethod: string; amount: number; transactionId: string },
    token: string
) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId, paymentMethod, amount, transactionId }),
        });

        if (!response.ok) {
            throw new Error(`Payment failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during payment:', error);
        throw error;
    }
};
