const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Register a new user.
 * @param {Object} params - User details.
 * @param {string} params.name - User's name.
 * @param {string} params.email - User's email.
 * @param {string} params.password - User's password.
 * @returns {Promise<Object>} - API response.
 */
export const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error(`Registration failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

/**
 * Login a user.
 * @param {Object} params - Login credentials.
 * @param {string} params.email - User's email.
 * @param {string} params.password - User's password.
 * @returns {Promise<Object>} - API response.
 */
export const login = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

/**
 * Logout a user.
 * @param {string} token - Access token of the logged-in user.
 * @returns {Promise<Object>} - API response.
 */
export const logout = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Logout failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

/**
 * Verify the validity of a user's token.
 * @param {string} token - Access token of the user.
 * @returns {Promise<boolean>} - True if the token is valid, otherwise false.
 */
export const verifyToken = async (token: string): Promise<boolean> => {
    console.log("authAPI", token)
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        console.log(JSON.stringify(response))

        if (response.ok) {
            return true; // Token is valid
        }

        if (response.status === 401) {
            return false; // Token is expired
        }

        throw new Error(`Token verification failed: ${response.statusText}`);
    } catch (error) {
        console.error('Error during token verification:', error);
        return false;
    }
};
