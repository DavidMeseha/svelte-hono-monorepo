<script lang="ts">
	import { addToCart } from '$lib/api/cartApi';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { ShoppingCart, Star } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	export let product: Product;

	let isAddingToCart = false;
	let toastMessage: string | null = null;
	let toastTimeout: number | null = null;

	const handleAddToCart = async () => {
		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			showToast('You need to log in to add items to the cart.', true);
			goto('/login');
			return;
		}

		isAddingToCart = true;

		try {
			await addToCart({ productId: product.id, quantity: 1 }, token);
			showToast('Item added to cart successfully!');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart.';
			showToast(errorMessage, true);
		} finally {
			isAddingToCart = false;
		}
	};

	const showToast = (message: string, isError = false) => {
		if (toastTimeout) clearTimeout(toastTimeout);

		toastMessage = message;

		toastTimeout = setTimeout(() => {
			toastMessage = null;
		}, 3000);

		if (isError) console.error(message);
	};
</script>

<article class="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl">
	<!-- Discount Badge -->
	<div
		class="absolute -right-12 top-6 z-10 rotate-45 bg-red-500 px-12 py-1 text-sm font-semibold text-white"
		aria-label={`${'00'}% discount`}
	>
		00% OFF
	</div>

	<!-- Product Image and Quick View -->
	<a
		href={`/products/${product.seName}`}
		class="relative block aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
		aria-label={`View details for ${product.name}`}
	>
		<img
			src={product.image}
			alt={product.name}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
		/>
	</a>

	<!-- Product Details -->
	<div class="p-5">
		<!-- Rating -->
		<div
			class="mb-2 flex items-center space-x-1"
			aria-label={`Rating: ${product.avgRating} out of 5 stars`}
		>
			{#each Array(5) as _, i}
				<Star
					size={16}
					class="fill-current {i < Math.round(product.avgRating)
						? 'text-yellow-400'
						: 'text-gray-300'}"
					aria-hidden="true"
				/>
			{/each}
			<span class="ml-2 text-sm text-gray-600">({product.totalRatings} reviews)</span>
		</div>

		<!-- Title and Description -->
		<a
			href={`/products/${product.seName}`}
			class="block focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<h2 class="mb-2 line-clamp-1 text-xl font-semibold text-gray-800">{product.name}</h2>
			<p class="mb-4 line-clamp-2 text-sm text-gray-600">{product.description}</p>
		</a>

		<!-- Price and Add to Cart -->
		<div class="flex items-center justify-between">
			<div aria-label={`Price: $${product.price}`}>
				<div class="text-2xl font-bold text-gray-900">${product.price}</div>
			</div>

			<button
				on:click={handleAddToCart}
				class="flex h-9 max-w-9 items-center rounded-full bg-blue-600 px-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 group-hover:max-w-36"
				disabled={isAddingToCart}
				aria-label={isAddingToCart ? 'Adding to cart...' : 'Add to cart'}
			>
				<div class="w-6 h-6 flex items-center justify-center me-2.5">
					<ShoppingCart size={18} aria-hidden="true" />
				</div>
				<span class="inline-block text-nowrap transition-all duration-200 ease-in-out">
					{isAddingToCart ? 'Adding...' : 'Add to Cart'}
				</span>
			</button>
		</div>

		<!-- Stock Status -->
		<div class="mt-4 flex items-center space-x-2">
			<div class="h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden="true"></div>
			<span class="text-sm text-gray-600">In Stock</span>
		</div>
	</div>
</article>

<!-- Toast Notification -->
{#if toastMessage}
	<div
		role="status"
		transition:fly={{ y: 50, duration: 300 }}
		class="fixed bottom-5 right-5 z-50 flex items-center space-x-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg"
	>
		{#if toastMessage.includes('success')}
			<svg
				class="h-5 w-5 text-green-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		{:else}
			<svg
				class="h-5 w-5 text-red-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{/if}
		<span class="text-sm">{toastMessage}</span>
	</div>
{/if}

<style>
	/* Star hover effect styles */
	:global(.star-hover) {
		@apply transition-transform duration-200;
	}
	:global(.star-hover:hover) {
		@apply scale-125;
	}
</style>
