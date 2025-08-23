// src/lib/stores/authStore.ts
import { writable } from 'svelte/store';
import { verifyToken } from '$lib/api/authApi';

function createAuthStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        login: () => set(true),
        logout: () => set(false),
        initialize: async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                set(false);
                return;
            }

            try {
                const isValid = await verifyToken(token);
                if (!isValid) {
                    localStorage.removeItem('accessToken');
                    set(false);
                    return;
                }
                set(true);
            } catch (error) {
                localStorage.removeItem('accessToken');
                set(false);
            }
        }
    };
}

export const authStore = createAuthStore();