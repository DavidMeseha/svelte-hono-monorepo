<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fetchOrders } from '$lib/api/ordersApi';
	import { Package, Truck, CheckCircle, Clock, AlertCircle, Ban } from 'lucide-svelte';

	let orders: Array<{
		_id: string;
		items: Array<{
			product: {
				_id: string;
				name: string;
				description: string;
				price: number;
				images?: string[];
			};
			quantity: number;
			subtotal: number;
		}>;
		total_price: number;
		status: string;
		estimated_delivery: string | null;
		createdAt: string;
	}> = [];

	let stats: {
		totalOrders: number;
		totalAmount: number;
		averageOrderValue: string;
	} | null = null;

	let isLoading = true;
	let error: string | null = null;

	// Status mapping for progress bar
	const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

	// Get status icon component based on status
	function getStatusIcon(status: string) {
		switch (status) {
			case 'pending':
				return Clock;
			case 'confirmed':
				return CheckCircle;
			case 'processing':
				return Package;
			case 'shipped':
				return Truck;
			case 'delivered':
				return CheckCircle;
			case 'cancelled':
				return Ban;
			default:
				return AlertCircle;
		}
	}

	// Get status color class based on status
	function getStatusColor(status: string) {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800';
			case 'processing':
				return 'bg-purple-100 text-purple-800';
			case 'shipped':
				return 'bg-indigo-100 text-indigo-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Get icon color based on status
	function getIconColor(status: string) {
		switch (status) {
			case 'pending':
				return '#EAB308';
			case 'confirmed':
				return '#3B82F6';
			case 'processing':
				return '#9333EA';
			case 'shipped':
				return '#4F46E5';
			case 'delivered':
				return '#22C55E';
			case 'cancelled':
				return '#EF4444';
			default:
				return '#6B7280';
		}
	}

	// Fetch orders on page load
	onMount(async () => {
		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			goto('/login');
			return;
		}

		try {
			const response = await fetchOrders(token);
			orders = response.orders;
			stats = response.stats;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch orders.';
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="min-h-screen bg-gray-50 p-6">
	{#if isLoading}
		<div class="text-center text-gray-600">Loading your orders...</div>
	{:else if error}
		<div class="text-center text-red-500">{error}</div>
		<p class="mt-4 text-center">
			<a href="/products" class="text-blue-500 hover:underline">Go back to products</a>
		</p>
	{:else}
		<div class="mx-auto max-w-7xl">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Order Dashboard</h1>
				<p class="mt-2 text-gray-600">Track and manage your orders</p>
			</div>

			<!-- Stats Cards -->
			<div class="mb-8 grid gap-6 md:grid-cols-3">
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="text-sm font-medium text-gray-500">Total Orders</div>
					<div class="mt-2 flex items-baseline">
						<span class="text-3xl font-bold text-gray-900">{stats?.totalOrders}</span>
						<span class="ml-2 text-sm text-gray-500">orders</span>
					</div>
				</div>

				<div class="rounded-lg bg-white p-6 shadow">
					<div class="text-sm font-medium text-gray-500">Total Revenue</div>
					<div class="mt-2 flex items-baseline">
						<span class="text-3xl font-bold text-gray-900">${stats?.totalAmount.toFixed(2)}</span>
					</div>
				</div>

				<div class="rounded-lg bg-white p-6 shadow">
					<div class="text-sm font-medium text-gray-500">Average Order Value</div>
					<div class="mt-2 flex items-baseline">
						<span class="text-3xl font-bold text-gray-900">${stats?.averageOrderValue}</span>
					</div>
				</div>
			</div>

			<!-- Orders List -->
			<div class="space-y-6">
				{#each orders as order}
					<div class="overflow-hidden rounded-lg bg-white shadow">
						<!-- Order Header -->
						<div class="border-b border-gray-200 bg-gray-50 p-6">
							<div class="flex items-center justify-between">
								<div>
									<h2 class="text-lg font-semibold text-gray-900">Order #{order._id}</h2>
									<p class="text-sm text-gray-500">
										Placed on {new Date(order.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div class="rounded-full px-3 py-1 text-sm {getStatusColor(order.status)}">
									<div class="flex items-center gap-2">
										<svelte:component
											this={getStatusIcon(order.status)}
											size={20}
											color={getIconColor(order.status)}
										/>
										{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
									</div>
								</div>
							</div>
						</div>

						<div class="p-6">
							<!-- Order Progress -->
							<div class="mb-8">
								<div class="relative">
									<div class="absolute left-0 top-2 h-0.5 w-full bg-gray-200">
										<div
											class="absolute h-full bg-green-500 transition-all duration-500"
											style="width: {((statuses.indexOf(order.status) + 1) / 5) * 100}%"
										/>
									</div>
									<div class="relative flex justify-between">
										{#each ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] as step, index}
											<div class="text-center">
												<div
													class="mx-auto h-4 w-4 rounded-full border-2 {statuses.indexOf(order.status) >= index
														? 'border-green-500 bg-green-500'
														: 'border-gray-300 bg-white'}"
												/>
												<div class="mt-2 text-xs font-medium text-gray-500">{step}</div>
											</div>
										{/each}
									</div>
								</div>
							</div>

							<!-- Order Items -->
							{#each order.items as item}
								<div class="flex items-start space-x-4">
									<img
										src={item.product.images?.[0] || '/api/placeholder/120/120'}
										alt={item.product.name}
										class="h-24 w-24 rounded-lg object-cover"
									/>
									<div class="flex-1">
										<h3 class="font-medium text-gray-900">{item.product.name}</h3>
										<p class="mt-1 text-sm text-gray-500">{item.product.description}</p>
										<div class="mt-2 flex items-center justify-between">
											<div class="text-sm text-gray-500">Quantity: {item.quantity}</div>
											<div class="text-sm font-medium text-gray-900">${item.subtotal.toFixed(2)}</div>
										</div>
									</div>
								</div>
							{/each}

							<hr class="my-6 border-t border-gray-200" />

							<!-- Order Summary -->
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-gray-500">Estimated Delivery</p>
									<p class="font-medium text-gray-900">
										{order.estimated_delivery
											? new Date(order.estimated_delivery).toLocaleDateString()
											: 'Not available'}
									</p>
								</div>
								<div class="text-right">
									<p class="text-sm text-gray-500">Total Amount</p>
									<p class="text-lg font-bold text-gray-900">${order.total_price.toFixed(2)}</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if orders.length === 0}
				<div class="text-center text-gray-600">You have no orders.</div>
				<p class="mt-4 text-center">
					<a href="/products" class="text-blue-500 hover:underline">Browse Products</a>
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Add any additional custom styles here if needed */
	:global(.lucide) {
		display: inline-block;
		vertical-align: middle;
	}
</style>