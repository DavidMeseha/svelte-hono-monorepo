<script lang="ts">
	import { register } from '$lib/api/authApi';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let password = '';
	let error: string | null = null;
	let isLoading = false;

	const handleRegister = async () => {
		error = null;

		if (!name || !email || !password) {
			error = 'All fields are required';
			return;
		}

		isLoading = true;

		try {
			await register({ name, email, password });
			goto('/login'); // Redirect to login page
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registration failed';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
		<h1 class="mb-4 text-center text-xl font-semibold text-gray-800">Create an Account</h1>
		<form on:submit|preventDefault={handleRegister} class="space-y-4">
			<!-- Name Input -->
			<div>
				<label for="name" class="block text-sm font-medium text-gray-600">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					placeholder="Enter your name"
				/>
			</div>

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
					Registering...
				{:else}
					Register
				{/if}
			</button>
		</form>

		<!-- Error Message -->
		{#if error}
			<p class="mt-4 text-center text-sm text-red-500">{error}</p>
		{/if}

		<!-- Login Link -->
		<p class="mt-4 text-center text-sm text-gray-600">
			Already have an account?
			<a href="/login" class="text-blue-500 hover:underline">Login</a>
		</p>
	</div>
</div>
