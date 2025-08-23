<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	type Link = { name: string; href: string };
	export let links: Link[] = [];

	// Initialize with loading state if needed
	let isLoading = true;

	onMount(async () => {
		await authStore.initialize();
		isLoading = false;
	});
</script>

<nav class="bg-gray-900 p-4 shadow-lg">
	<div class="container mx-auto flex items-center justify-between">
		<!-- Left: Logo and Navigation Links -->
		<div class="flex items-center space-x-8">
			<!-- Logo -->
			<a href="/" class="text-lg font-bold text-white hover:text-blue-400">Ecom</a>

			<!-- Navigation Links -->
			<ul class="hidden space-x-6 md:flex">
				{#each links as { name, href }}
					<li>
						<a {href} class="text-sm font-medium text-gray-300 transition hover:text-white"
							>{name}</a
						>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right: Action Buttons -->
		<div class="flex items-center space-x-6">
			<!-- Login Button: Render only if the user is not logged in -->
			{#if !$authStore}
				<a
					href="/login"
					class="hidden text-sm font-medium text-gray-300 transition hover:text-white md:block"
					>Login</a
				>
			{/if}

			<!-- Cart Icon -->
			<a href="/cart" aria-label="View Cart" class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-300 transition hover:text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13L3 21h14M9 17a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z"
					/>
				</svg>
			</a>

			<!-- Profile Icon -->
			<a href="/profile" aria-label="View Profile" class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-300 transition hover:text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5.121 17.804A9.056 9.056 0 0112 15a9.056 9.056 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm-9 11a9 9 0 1118 0H6z"
					/>
				</svg>
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="block md:hidden"
			aria-label="Open Menu"
			on:click={() => alert('Mobile menu coming soon!')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-gray-300 transition hover:text-white"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</div>
</nav>
