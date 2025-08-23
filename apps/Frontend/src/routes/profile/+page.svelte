<script lang="ts">
	import { fetchUserDetails } from '$lib/api/usersApi';
	import { logout } from '$lib/api/authApi';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	let user: {
		_id: string;
		name: string;
		email: string;
		isLocked: boolean;
		lastLogin: string | null;
		isVerified: boolean;
		role: string;
		createdAt: string;
		updatedAt: string;
		refreshToken: string;
		failedAttempts: number;
		lockUntil: string | null;
	} | null = null;

	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		if (typeof window !== 'undefined') {
			// Ensure we're in the browser
			const token = localStorage.getItem('accessToken') || '';

			if (token) {
				try {
					// Fetch user details
					const result = await fetchUserDetails(token);
					user = result; // Adjusted to match the new response structure
				} catch (err) {
					error = err instanceof Error ? err.message : 'Failed to fetch user details.';
				}
			} else {
				error = 'You are not logged in. Please log in to access your account and continue.';
			}
		} else {
			error = 'Cannot access localStorage during SSR.';
		}

		isLoading = false;
	});

	// Logout handler
	const handleLogout = async () => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('accessToken');
			if (token) {
				try {
					await logout(token); // Call the logout API
					localStorage.removeItem('accessToken'); // Clear access token
					authStore.logout(); // Update the auth store state
					goto('/login'); // Redirect to login page
				} catch (err) {
					error = err instanceof Error ? err.message : 'Failed to logout.';
				}
			} else {
				error = 'You are not logged in. Please log in to access your account and continue.';
			}
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
		{#if isLoading}
			<p class="text-center text-gray-600">Loading profile...</p>
		{:else if error}
			<p class="text-center text-red-500">{error}</p>
			<p class="mt-4 text-center">
				<a href="/login" class="text-blue-500 hover:underline">Login</a> to view your profile.
			</p>
		{:else if user}
			<h1 class="mb-4 text-center text-xl font-semibold text-gray-800">Your Profile</h1>
			<p class="mb-2">
				<strong>Name:</strong>
				{user.name}
			</p>
			<p class="mb-2">
				<strong>Email:</strong>
				{user.email}
			</p>
			<p class="mb-2">
				<strong>Last Login:</strong>
				{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
			</p>
			<p class="mb-2">
				<strong>Verified:</strong>
				{user.isVerified ? 'Yes' : 'No'}
			</p>
			<p class="mb-2">
				<strong>Role:</strong>
				{user.role}
			</p>

			<!-- Logout Button -->
			<button
				on:click={handleLogout}
				class="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
			>
				Logout
			</button>
		{:else}
			<p class="text-center text-gray-600">No profile data available.</p>
		{/if}
	</div>
</div>
