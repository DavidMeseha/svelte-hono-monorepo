<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { clearCart, deleteCartItem, fetchCartItems, updateCartItem } from '$lib/api/cartApi';
	import { createOrder } from '$lib/api/ordersApi';
	import { makePayment } from '$lib/api/paymentsApi';
	import { fetchAddresses, createAddress } from '$lib/api/addressApi';
	import type { Address, CartItem, Summary } from '$lib/types';
	import ProductCartItem from '$lib/components/ProductCartItem.svelte';

	let cart: Array<CartItem> = [];
	let summary: Summary = {
		subTotal: 0,
		tax: 0,
		shipping: 0,
		total: 0,
		totalItems: 0
	};

	// Address related state with proper typing
	let addresses: Address[] = [];
	let selectedAddressId = '';
	let newAddress: Omit<Address, 'id'> = {
		address_line_1: '',
		city: '',
		zipcode: '',
		state: '',
		is_default: false
	};
	let isLoadingAddresses = false;

	let isInit = true;
	let isLoadingSummary = false;
	let isLoadingItems = false;
	let error: string | null = null;
	let showPaymentForm = false;
	let orderId: string | null = null;

	// Form fields for payment
	let cardNumber = '';
	let expiryDate = '';
	let cvv = '';

	// Fetch cart items and addresses on mount
	onMount(async () => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('accessToken') || '';
			if (!token) {
				goto('/login');
				return;
			}

			try {
				const [cartResponse, addressResponse] = await Promise.all([
					fetchCartItems(token),
					Promise.resolve({ data: [] })
				]);

				cart = cartResponse.items;
				summary = cartResponse.summary;
				addresses = addressResponse.data;
				selectedAddressId = addresses.find((address) => address.is_default)?.id || '';
			} catch (err) {
				error = err instanceof Error ? err.message : 'Failed to fetch cart items or addresses.';
			} finally {
				isInit = false;
				isLoadingAddresses = false;
			}
		}
	});

	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (!cart) return;

		const token = localStorage.getItem('accessToken');
		if (!token) {
			alert('You need to log in to update cart items.');
			return;
		}

		try {
			isInit = true;
			const response = await updateCartItem({ itemId, quantity: newQuantity }, token);

			// Update the local cart with the new values
			const updatedItem = response.updatedItem;
			cart = cart.map((item) =>
				item.product.id === itemId
					? { ...item, quantity: updatedItem.quantity, subtotal: updatedItem.subtotal }
					: item
			);
			cart = response.items;
			summary = response.summary; // Update the summary
		} catch (err) {
			console.log(err);
			alert('Failed to update the cart item.');
		} finally {
			isInit = false;
		}
	};

	const handleDeleteItem = async (itemId: string) => {
		if (!itemId || !cart) return;

		isInit = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to delete a cart item.');
			}

			// Call the API to delete the cart item
			await deleteCartItem(itemId, token);

			// Update the cart by removing the deleted item
			cart = cart.filter((item) => item.id !== itemId);
			summary.totalItems = cart.reduce((total, item) => total + item.quantity, 0);
			summary.subTotal = cart.reduce((total, item) => total + item.product.price, 0);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete cart item.';
		} finally {
			isInit = false;
		}
	};

	const handleClearCart = async () => {
		if (!cart) return;

		isInit = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to clear the cart.');
			}

			// Call the API to clear the cart
			await clearCart(token);

			// Clear the local cart
			cart = [];
			alert('Cart cleared successfully!');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to clear the cart.';
		} finally {
			isInit = false;
		}
	};

	const handleAddAddress = async () => {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			alert('You need to log in to add an address.');
			return;
		}

		try {
			// Add the new address to the server
			await createAddress(newAddress, token);

			// Fetch the updated addresses list
			const updatedAddresses = await fetchAddresses(token);

			// Update the addresses state with the newly fetched list
			addresses = updatedAddresses.data;
			selectedAddressId = addresses.find((address) => address.is_default)?.id || '';

			alert('Address added successfully!');

			// Reset the form
			newAddress = {
				address_line_1: '',
				city: '',
				zipcode: '',
				state: '',
				is_default: false
			};
		} catch (err) {
			alert('Failed to add address.');
			console.error(err);
		}
	};

	// Handle Checkout
	const handleCheckout = async () => {
		if (!cart) return;
		if (!selectedAddressId) {
			alert('Please select a delivery address before proceeding to checkout.');
			return;
		}

		isInit = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to proceed with checkout.');
			}

			// Create an order with the selected address
			const response = await createOrder(token, selectedAddressId);
			orderId = response.order.id;
			showPaymentForm = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Checkout failed.';
		} finally {
			isInit = false;
		}
	};

	// Handle Payment Submission
	const handlePayment = async () => {
		if (!orderId) return;
		isInit = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to proceed with payment.');
			}

			// Payment submission with test card details
			const paymentResponse = await makePayment(
				{
					orderId,
					paymentMethod: 'credit_card',
					amount: summary.total || 0,
					transactionId: `txn-${Date.now()}`
				},
				token
			);

			alert('Payment successful!');
			goto('/orders'); // Redirect to the orders page
		} catch (err) {
			error = err instanceof Error ? err.message : 'Payment failed.';
		} finally {
			isInit = false;
		}
	};
</script>

<div class="min-h-screen bg-gray-100 p-6">
	<!-- Loading State -->
	{#if isInit}
		<div class="text-center text-gray-600">Loading your cart...</div>
	{:else if error}
		<div class="text-center text-red-500">{error}</div>
		<p class="mt-4 text-center">
			<a href="/products" class="text-blue-500 hover:underline">Go back to products</a>
		</p>

		<!-- Cart Items -->
	{:else if cart && cart.length > 0}
		<h1 class="mb-6 text-center text-2xl font-semibold text-gray-800">Your Cart</h1>
		<div class="grid gap-6 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				{#each cart as item}
					<ProductCartItem {item} {handleDeleteItem} {handleUpdateQuantity} />
				{/each}

				<!-- Address Section -->
				<div class="rounded border border-gray-200 bg-white p-6 shadow">
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Select or Add Address</h2>

					{#if isLoadingAddresses}
						<p>Loading addresses...</p>
					{:else if addresses.length > 0}
						<div class="space-y-4">
							{#each addresses as address}
								<div class="flex items-center space-x-4">
									<input
										type="radio"
										id={address.id}
										name="address"
										value={address.id}
										bind:group={selectedAddressId}
										class="text-blue-500 focus:ring-blue-400"
									/>
									<label for={address.id} class="text-gray-700">
										{address.address_line_1}, {address.city}, {address.state}
										{address.zipcode}
										{#if address.is_default}
											<span class="text-sm text-green-600">(Default)</span>
										{/if}
									</label>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500">No addresses available. Add a new one below.</p>
					{/if}

					<h3 class="mb-2 mt-6 text-lg font-semibold text-gray-800">Add New Address</h3>
					<div class="grid gap-4">
						<input
							type="text"
							bind:value={newAddress.address_line_1}
							placeholder="Address Line 1"
							class="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-200"
						/>
						<input
							type="text"
							bind:value={newAddress.city}
							placeholder="City"
							class="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-200"
						/>
						<input
							type="text"
							bind:value={newAddress.state}
							placeholder="State"
							class="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-200"
						/>
						<input
							type="text"
							bind:value={newAddress.zipcode}
							placeholder="ZIP Code"
							class="w-full rounded border border-gray-300 p-2 focus:ring focus:ring-blue-200"
						/>
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								bind:checked={newAddress.is_default}
								class="rounded border-gray-300 text-blue-500 focus:ring focus:ring-blue-400"
							/>
							<label class="text-gray-700" for="">Set as Default Address</label>
						</div>
						<button
							on:click={handleAddAddress}
							class="w-full rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
						>
							Add Address
						</button>
					</div>
				</div>
			</div>

			<!-- Cart Summary -->
			<div class="rounded border border-gray-200 bg-white p-6 shadow">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Cart Summary</h2>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span>Subtotal:</span>
						<span>${summary.subTotal}</span>
					</div>
					<div class="flex justify-between">
						<span>Tax:</span>
						<span>${summary.tax}</span>
					</div>
					<div class="flex justify-between">
						<span>Shipping:</span>
						<span>${summary.shipping}</span>
					</div>
					<hr class="my-2" />
					<div class="flex justify-between font-semibold">
						<span>Total:</span>
						<span>${summary.total}</span>
					</div>
					<div class="flex justify-between">
						<span>Total Items:</span>
						<span>{summary.totalItems}</span>
					</div>
				</div>
				<div class="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<button
						on:click={handleClearCart}
						class="w-full rounded bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 sm:w-auto"
						aria-label="Clear cart"
					>
						Clear Cart
					</button>
					<button
						on:click={handleCheckout}
						class="w-full rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 sm:w-auto"
						aria-label="Proceed to checkout"
					>
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>

		{#if showPaymentForm}
			<div class="mt-8 rounded border border-gray-200 bg-white p-6 shadow">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Payment Details</h2>
				<p class="mb-4 text-sm text-gray-600">
					Fill in your payment details to complete the order.
				</p>
				<div class="space-y-4">
					<div>
						<label for="cardNumber" class="block text-sm font-medium text-gray-600"
							>Card Number</label
						>
						<input
							id="cardNumber"
							type="text"
							bind:value={cardNumber}
							class="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
					</div>
					<div class="flex space-x-4">
						<div>
							<label for="expiryDate" class="block text-sm font-medium text-gray-600"
								>Expiry Date</label
							>
							<input
								id="expiryDate"
								type="text"
								bind:value={expiryDate}
								class="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
								placeholder="MM/YY"
							/>
						</div>
						<div>
							<label for="cvv" class="block text-sm font-medium text-gray-600">CVV</label>
							<input
								id="cvv"
								type="text"
								bind:value={cvv}
								class="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							/>
						</div>
					</div>
					<button
						on:click={handlePayment}
						class="mt-6 w-full rounded bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
					>
						Submit Payment
					</button>
				</div>
			</div>
		{/if}
	{:else}
		<div class="text-center text-gray-600">Your cart is empty.</div>
		<p class="mt-4 text-center">
			<a href="/products" class="text-blue-500 hover:underline">Browse Products</a>
		</p>
	{/if}
</div>
