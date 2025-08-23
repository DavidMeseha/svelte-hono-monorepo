<script lang="ts">
	import { login } from '$lib/api/authApi';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	let email = '';
	let password = '';
	let error: string | null = null;
	let isLoading = false;

	const handleLogin = async () => {
		error = null;

		if (!email || !password) {
			error = 'All fields are required';
			return;
		}

		isLoading = true;

		try {
			const response = await login({ email, password });
			localStorage.setItem('accessToken', response.data.accessToken); // Store tokens securely
			authStore.login(); // Update the auth store state
			goto('/'); // Redirect to home or dashboard
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
		<h1 class="mb-4 text-center text-xl font-semibold text-gray-800">Login</h1>
		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<!-- Email Input -->
			<div>
				<label for="email" class="block text-sm font-medium text-gray-600">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					placeholder="Enter your email"
				/>
			</div>

			<!-- Password Input -->
			<div>
				<label for="password" class="block text-sm font-medium text-gray-600">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					placeholder="Enter your password"
				/>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isLoading}
				class="mt-4 block w-full rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:bg-gray-300"
			>
				{#if isLoading}
					Logging in...
				{:else}
					Login
				{/if}
			</button>
		</form>

		<!-- Error Message -->
		{#if error}
			<p class="mt-4 text-center text-sm text-red-500">{error}</p>
		{/if}

		<!-- Register Link -->
		<p class="mt-4 text-center text-sm text-gray-600">
			Don't have an account?
			<a href="/register" class="text-blue-500 hover:underline">Register</a>
		</p>
	</div>
</div>
