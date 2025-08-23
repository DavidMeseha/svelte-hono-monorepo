import type { UserResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch user details using the access token.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<UserResponse>} - The response containing user details.
 */
export const fetchUserDetails = async (token: string): Promise<UserResponse> => {
    console.log(token)
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        // Log the raw response if the status is not OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Failed to fetch user details: HTTP ${response.status}`);
        }

        // Parse and return JSON response
        return (await response.json()) as UserResponse;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

