<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { navItems } from '$lib/constants';
	import ProfileIcon from './icons/ProfileIcon.svelte';
	import CartIcon from './icons/CartIcon.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';
	import Logo from './icons/Logo.svelte';
</script>

<nav class="bg-gray-900 p-4 shadow-lg">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center space-x-8">
			<Logo />

			<!-- Navigation Links -->
			<ul class="hidden space-x-6 md:flex">
				{#each navItems as { name, href }}
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
			{#if !$authStore}
				<a
					href="/login"
					class="hidden text-sm font-medium text-gray-300 transition hover:text-white md:block"
					>Login</a
				>
			{/if}

			<a href="/cart" aria-label="View Cart" class="relative">
				<CartIcon />
			</a>

			<a href="/profile" aria-label="View Profile" class="relative">
				<ProfileIcon />
			</a>
		</div>

		<button
			class="block md:hidden"
			aria-label="Open Menu"
			on:click={() => alert('Mobile menu coming soon!')}
		>
			<MenuIcon />
		</button>
	</div>
</nav>
