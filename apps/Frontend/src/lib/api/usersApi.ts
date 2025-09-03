import type { UserDetailsResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch user details using the access token.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<UserDetailsResponse>} - The response containing user details.
 */
export const fetchUserDetails = async (token: string): Promise<UserDetailsResponse> => {
	console.log(token);
	try {
		const response = await fetch(`${API_BASE_URL}/api/user/details`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch user details: HTTP ${response.status}`);
		}

		return (await response.json()).user;
	} catch (error) {
		throw error;
	}
};
