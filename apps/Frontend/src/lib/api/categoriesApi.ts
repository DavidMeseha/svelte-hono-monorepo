// src/lib/api/categoriesApi.ts
import type { Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all categories.
 * @returns {Promise<Category[]>} - Array of categories.
 */
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: HTTP ${response.status}`);
        }

        return (await response.json()) as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
