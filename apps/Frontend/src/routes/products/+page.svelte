<script lang="ts">
	import { fetchProducts } from '$lib/api/productsApi';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { Product, ProductResponse, Category } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let products: Product[] = [];
	let isLoading = true;
	let isInit = true;
	let error: string | null = null;

	// Pagination state
	let currentPage = 1;
	let totalPages = 1;

	// Search and filter state
	let searchQuery = '';
	let selectedCategory = '';
	let priceRange = [0, 100000]; // Updated default max price
	let sortBy = 'price';

	// Sort options
	const sortOptions = [
		{ label: 'Price: Low to High', value: 'price' },
		{ label: 'Price: High to Low', value: '-price' },
		{ label: 'Name: A to Z', value: 'name' },
		{ label: 'Name: Z to A', value: '-name' }
	];

	// Fetch products
	const fetchProductData = async (page = 1) => {
		isLoading = true;
		error = null;

		try {
			const result: ProductResponse = await fetchProducts({
				page,
				limit: 20, // Updated limit to 20
				sort: sortBy,
				category: selectedCategory,
				minPrice: priceRange[0],
				maxPrice: priceRange[1],
				search: searchQuery
			});

			products = result.products;
			currentPage = result.metadata.page;
			totalPages = result.metadata.pages;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			console.error('Error loading products:', err);
		} finally {
			isLoading = false;
			isInit = false;
		}
	};

	// Initialize products on component mount
	onMount(() => {
		fetchProductData(1);
	});

	// Pagination handlers
	const goToNextPage = () => {
		if (currentPage < totalPages) {
			fetchProductData(currentPage + 1);
		}
	};

	const goToPrevPage = () => {
		if (currentPage > 1) {
			fetchProductData(currentPage - 1);
		}
	};

	// Apply filters
	const applyFilters = () => {
		fetchProductData(1);
	};
</script>

<div class="space-y-4 p-4">
	<!-- Search and Filter Section -->
	<div class="space-y-4 rounded bg-gray-50 p-4 shadow">
		<!-- Filter Section -->
		<div class="flex flex-wrap items-center gap-4">
			<!-- Search Bar -->
			<div class="relative min-w-[200px] flex-[2]">
				<input
					type="text"
					placeholder="Search..."
					bind:value={searchQuery}
					class="w-full rounded border border-gray-300 p-2 pl-10 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
				/>
				<svg
					class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 19c4.418 0 8-3.582 8-8S15.418 3 11 3 3 6.582 3 11s3.582 8 8 8zM21 21l-4.35-4.35"
					></path>
				</svg>
			</div>

			<!-- Sort Filter -->
			<div class="min-w-[150px] flex-1">
				<select
					bind:value={sortBy}
					class="w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<!-- Price Range -->
			<div class="flex items-center gap-2">
				<input
					type="number"
					placeholder="Min"
					bind:value={priceRange[0]}
					class="w-[80px] rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
				/>
				<span class="text-gray-500">-</span>
				<input
					type="number"
					placeholder="Max"
					bind:value={priceRange[1]}
					class="w-[80px] rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
				/>
			</div>

			<!-- Apply Filters Button -->
			<div class="min-w-[100px] flex-1">
				<button
					disabled={isLoading || isInit}
					on:click={applyFilters}
					class="w-full rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
				>
					{isLoading || isInit ? 'loading...' : 'Apply'}
				</button>
			</div>
		</div>
	</div>

	<!-- Initial products loading -->
	{#if isInit}
		<p class="text-gray-500">Loading products...</p>

		<!-- Error State -->
	{:else if error}
		<p class="text-red-500">Error: {error}</p>

		<!-- Product List -->
	{:else if products.length > 0}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{#each products as product}
				<ProductCard {product} />
			{/each}
		</div>

		<!-- Pagination -->
		<div class="mt-4 flex flex-wrap items-center justify-center gap-4">
			<button
				on:click={goToPrevPage}
				disabled={currentPage === 1}
				class="rounded border bg-gray-100 px-4 py-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
			>
				&lt; Prev
			</button>
			<span class="text-gray-600">
				{currentPage} of {totalPages}
			</span>
			<button
				on:click={goToNextPage}
				disabled={currentPage === totalPages}
				class="rounded border bg-gray-100 px-4 py-2 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Next &gt;
			</button>
		</div>

		<!-- No Products Available -->
	{:else}
		<p>No products available.</p>
	{/if}
</div>
