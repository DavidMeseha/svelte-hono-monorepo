<script lang="ts">
	import { fetchProductDetails } from '$lib/api/productsApi';
	import { createRating } from '$lib/api/ratingsApi';
	import { addToCart } from '$lib/api/cartApi';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { ShoppingCart, Star, ChevronRight, Package, ShieldCheck } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let product: Product | null = null;
	let isLoading = true;
	let error: string | null = null;
	let selectedImageIndex = 0;
	let isAddingToCart = false;
	let toastMessage: string | null = null;
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;
	let newRating = 0;
	let newComment = '';
	let isSubmittingReview = false;

	const productSeName = $page.params.seName ?? '';

	onMount(async () => {
		try {
			product = await fetchProductDetails(productSeName);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	});

	const handleAddToCart = async () => {
		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			showToast('You need to log in to add items to the cart.', true);
			goto('/login');
			return;
		}

		if (!product?.id) {
			showToast('Invalid product ID.', true);
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

	const handleAddReview = async () => {
		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			showToast('You need to log in to add a review.', true);
			goto('/login');
			return;
		}

		if (!newRating || !newComment) {
			showToast('Please provide a rating and a comment.', true);
			return;
		}

		isSubmittingReview = true;

		try {
			const response = await createRating(product?.id ?? '', newRating, newComment, token);
			showToast('Review added successfully!');
			if (product) {
				product.avgRating = parseFloat(response.productStats.averageRating);
				product.totalRatings = response.productStats.totalRatings;
				product.ratings.unshift(response.rating);
			}
			newRating = 0;
			newComment = '';
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to add review.';
			showToast(errorMessage, true);
		} finally {
			isSubmittingReview = false;
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

<div class="min-h-screen bg-gray-50">
	{#if isLoading}
		<div class="flex min-h-screen items-center justify-center">
			<div class="text-center">
				<div
					class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
				<p class="text-lg text-gray-600">Loading product details...</p>
			</div>
		</div>
	{:else if error}
		<div class="flex min-h-screen items-center justify-center">
			<div class="text-center text-lg text-red-500">
				<p>Error: {error}</p>
				<a href="/products" class="mt-4 inline-block text-blue-500 hover:underline">
					Return to Products
				</a>
			</div>
		</div>
	{:else if product}
		<!-- Breadcrumb -->
		<div class="bg-white shadow">
			<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div class="flex items-center space-x-2 text-sm text-gray-600">
					<a href="/" class="hover:text-blue-500">Home</a>
					<ChevronRight size={16} />
					<a href="/products" class="hover:text-blue-500">Products</a>
					<ChevronRight size={16} />
					<span class="text-gray-900">{product.name}</span>
				</div>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Product Section -->
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
				<!-- Product Images -->
				<div class="space-y-4">
					<div
						class="aspect-square overflow-hidden rounded-xl border bg-white"
						in:fade={{ duration: 200 }}
					>
						<img
							src={product.image ?? '/api/placeholder/600/600'}
							alt={product.name}
							class="h-full w-full object-cover"
						/>
					</div>
					{#if product.image}
						<div class="grid grid-cols-4 gap-4">
							<!-- {#each product.image as image, index}
								<button
									class="aspect-square overflow-hidden rounded-lg border {selectedImageIndex ===
									index
										? 'ring-2 ring-blue-500'
										: 'hover:ring-2 hover:ring-gray-300'}"
									on:click={() => (selectedImageIndex = index)}
								> -->
							<img
								src={product.image}
								alt={`${product.name} - View ${0}`}
								class="h-full w-full object-cover"
							/>
							<!-- </button>
							{/each} -->
						</div>
					{/if}
				</div>

				<!-- Product Details -->
				<div class="space-y-6">
					<div>
						<h1 class="text-3xl font-bold text-gray-900">{product.name}</h1>
						<p class="mt-2 text-sm text-gray-500">Category: category</p>
					</div>

					<!-- Rating Summary -->
					<div class="flex items-center space-x-4">
						<div class="flex items-center">
							{#each Array(5) as _, i}
								<Star
									size={20}
									class="fill-current {i < Math.round(product.avgRating)
										? 'text-yellow-400'
										: 'text-gray-300'}"
								/>
							{/each}
						</div>
						<span class="text-sm text-gray-600">
							{product.avgRating} ({product.totalRatings} reviews)
						</span>
					</div>

					<!-- Price and Stock -->
					<div class="rounded-lg bg-gray-50 p-6">
						<div class="flex items-baseline space-x-2">
							<span class="text-3xl font-bold text-gray-900">${product.price}</span>
							<span class="text-sm text-gray-500">USD</span>
						</div>
						<div class="mt-4 flex items-center space-x-2">
							<div
								class="h-3 w-3 rounded-full {product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}"
							></div>
							<span class="text-sm {product.stock > 0 ? 'text-green-700' : 'text-red-700'}">
								{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
							</span>
						</div>
					</div>

					<!-- Description -->
					<p class="text-gray-600">{product.description}</p>

					<!-- Features -->
					<div class="grid grid-cols-2 gap-4">
						<div class="flex items-center space-x-2">
							<Package class="text-blue-500" size={20} />
							<span class="text-sm text-gray-600">Free Shipping</span>
						</div>
						<div class="flex items-center space-x-2">
							<ShieldCheck class="text-blue-500" size={20} />
							<span class="text-sm text-gray-600">2 Year Warranty</span>
						</div>
					</div>

					<!-- Add to Cart -->
					<button
						on:click={handleAddToCart}
						class="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
						disabled={isAddingToCart || product.stock === 0}
					>
						<ShoppingCart size={24} />
						<span>{isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
					</button>
				</div>
			</div>

			<!-- Reviews Section -->
			<div class="mt-16">
				<h2 class="text-2xl font-bold text-gray-900">Customer Reviews</h2>

				<!-- Add Review Form -->
				<div class="mt-8 rounded-lg bg-white p-6 shadow-lg">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Write a Review</h3>
					<div class="space-y-4">
						<div>
							<label for="rating" class="mb-2 block text-sm font-medium text-gray-700">
								Rating
							</label>
							<select
								id="rating"
								bind:value={newRating}
								class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
							>
								<option value="0">Select a rating</option>
								{#each [1, 2, 3, 4, 5] as rating}
									<option value={rating}>{rating} {rating === 1 ? 'Star' : 'Stars'}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="comment" class="mb-2 block text-sm font-medium text-gray-700">
								Your Review
							</label>
							<textarea
								id="comment"
								bind:value={newComment}
								rows="4"
								class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
								placeholder="Share your thoughts about the product..."
							></textarea>
						</div>

						<button
							on:click={handleAddReview}
							class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
							disabled={isSubmittingReview}
						>
							{isSubmittingReview ? 'Submitting...' : 'Submit Review'}
						</button>
					</div>
				</div>

				<!-- Reviews List -->
				{#if product.ratings && product.ratings.length > 0}
					<div class="mt-8 space-y-6">
						{#each product.ratings as rating}
							<div class="rounded-lg bg-white p-6 shadow-lg" in:fade={{ duration: 200 }}>
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-1">
										{#each Array(5) as _, i}
											<Star
												size={16}
												class="fill-current {i < rating.rating
													? 'text-yellow-400'
													: 'text-gray-300'}"
											/>
										{/each}
									</div>
									<time class="text-sm text-gray-500" datetime={rating.createdAt}>
										{new Date(rating.createdAt).toLocaleDateString()}
									</time>
								</div>
								<p class="mt-4 text-gray-600">{rating.comments}</p>
							</div>
						{/each}
					</div>
				{:else}
					<div class="mt-8 text-center text-gray-500">
						No reviews yet. Be the first to review this product!
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="flex min-h-screen items-center justify-center">
			<p class="text-lg text-gray-600">Product not found.</p>
		</div>
	{/if}
</div>

<!-- Toast Notification -->
{#if toastMessage}
	<div
		transition:fly={{ y: 50, duration: 300 }}
		class="fixed bottom-5 right-5 z-50 flex items-center space-x-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg"
	>
		<span class="text-sm">{toastMessage}</span>
	</div>
{/if}
