const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch user's addresses.
 * @param {string} token - Authorization token.
 * @returns {Promise<any>} - List of addresses.
 */
export const fetchAddresses = async (token: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/address/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch addresses: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

/**
 * Create a new address.
 * @param {Object} address - Address details.
 * @param {string} address.address_line_1 - First line of address.
 * @param {string} address.city - City.
 * @param {string} address.zipcode - ZIP code.
 * @param {string} address.state - State.
 * @param {boolean} address.is_default - Whether this is the default address.
 * @param {string} token - Authorization token.
 * @returns {Promise<any>} - Created address.
 */
export const createAddress = async (
    address: {
        address_line_1: string;
        city: string;
        zipcode: string;
        state: string;
        is_default: boolean;
    },
    token: string
): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/address/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(address),
        });

        if (!response.ok) {
            throw new Error(`Failed to create address: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating address:', error);
        throw error;
    }
};
