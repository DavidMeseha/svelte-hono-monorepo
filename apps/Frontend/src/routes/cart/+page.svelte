<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { clearCart, deleteCartItem, fetchCartItems, updateCartItem } from '$lib/api/cartApi';
	import { createOrder } from '$lib/api/ordersApi';
	import { makePayment } from '$lib/api/paymentsApi';
	import { fetchAddresses, createAddress } from '$lib/api/addressApi';

	interface Address {
		_id: string;
		address_line_1: string;
		city: string;
		state: string;
		zipcode: string;
		is_default: boolean;
	}

	let cart: {
		items: Array<{
			product: {
				_id: string;
				name: string;
				description: string;
				images: string[];
				price: number;
				stock_quantity: number;
			};
			quantity: number;
			subtotal: number;
			isAvailable: boolean;
			_id: string;
		}>;
		summary: {
			subtotal: number;
			tax: number;
			shipping: number;
			total: number;
			totalItems: number;
		};
	} | null = null;

	// Address related state with proper typing
	let addresses: Address[] = [];
	let selectedAddressId = '';
	let newAddress: Omit<Address, '_id'> = {
		address_line_1: '',
		city: '',
		zipcode: '',
		state: '',
		is_default: false
	};
	let isLoadingAddresses = true;

	let isLoading = true;
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
					fetchAddresses(token)
				]);

				cart = cartResponse.cart;
				addresses = addressResponse.data;
				selectedAddressId = addresses.find((address) => address.is_default)?._id || '';
			} catch (err) {
				error = err instanceof Error ? err.message : 'Failed to fetch cart items or addresses.';
			} finally {
				isLoading = false;
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
			isLoading = true;
			const response = await updateCartItem({ itemId, quantity: newQuantity }, token);

			// Update the local cart with the new values
			const updatedItem = response.updatedItem;
			cart.items = cart.items.map((item) =>
				item.product._id === itemId
					? { ...item, quantity: updatedItem.quantity, subtotal: updatedItem.subtotal }
					: item
			);
			cart.summary = response.cartSummary; // Update the summary
		} catch (err) {
			console.log(err);
			alert('Failed to update the cart item.');
		} finally {
			isLoading = false;
		}
	};

	const handleDeleteItem = async (itemId: string) => {
		if (!itemId || !cart) return;

		isLoading = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to delete a cart item.');
			}

			// Call the API to delete the cart item
			await deleteCartItem(itemId, token);

			// Update the cart by removing the deleted item
			cart.items = cart.items.filter((item) => item._id !== itemId);
			cart.summary.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
			cart.summary.subtotal = cart.items.reduce((total, item) => total + item.subtotal, 0);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete cart item.';
		} finally {
			isLoading = false;
		}
	};

	const handleClearCart = async () => {
		if (!cart) return;

		isLoading = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to clear the cart.');
			}

			// Call the API to clear the cart
			await clearCart(token);

			// Clear the local cart
			cart = null;
			alert('Cart cleared successfully!');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to clear the cart.';
		} finally {
			isLoading = false;
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
			selectedAddressId = addresses.find((address) => address.is_default)?._id || '';

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

		isLoading = true;
		error = null;

		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				throw new Error('You need to log in to proceed with checkout.');
			}

			// Create an order with the selected address
			const response = await createOrder(token, selectedAddressId);
			orderId = response.order._id;
			showPaymentForm = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Checkout failed.';
		} finally {
			isLoading = false;
		}
	};

	// Handle Payment Submission
	const handlePayment = async () => {
		if (!orderId) return;
		isLoading = true;
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
					amount: cart?.summary.total || 0,
					transactionId: `txn-${Date.now()}`
				},
				token
			);

			alert('Payment successful!');
			goto('/orders'); // Redirect to the orders page
		} catch (err) {
			error = err instanceof Error ? err.message : 'Payment failed.';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="min-h-screen bg-gray-100 p-6">
	<!-- Loading State -->
	{#if isLoading}
		<div class="text-center text-gray-600">Loading your cart...</div>

		<!-- Error State -->
	{:else if error}
		<div class="text-center text-red-500">{error}</div>
		<p class="mt-4 text-center">
			<a href="/products" class="text-blue-500 hover:underline">Go back to products</a>
		</p>

		<!-- Cart Items -->
	{:else if cart && cart.items.length > 0}
		<h1 class="mb-6 text-center text-2xl font-semibold text-gray-800">Your Cart</h1>
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Cart Items List -->
			<div class="space-y-6 lg:col-span-2">
				{#each cart.items as item}
					<div
						class="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg"
					>
						<!-- Product Image -->
						<div class="flex-shrink-0">
							{#if item.product.images.length > 0}
								<img
									src={item.product.images[0]}
									alt={item.product.name}
									class="h-24 w-24 rounded-lg object-cover"
								/>
							{:else}
								<img
									src="https://via.placeholder.com/300"
									alt={item.product.name}
									class="h-24 w-24 rounded-lg object-cover"
								/>
							{/if}
						</div>

						<!-- Product Details -->
						<div class="ml-6 flex-grow">
							<h2 class="text-lg font-semibold text-gray-800">{item.product.name}</h2>
							<p class="mt-1 line-clamp-2 text-sm text-gray-600">
								{item.product.description}
							</p>
							<p class="mt-2 text-sm text-gray-800">
								<strong>Price:</strong> ${item.product.price.toFixed(2)}
							</p>
							<div class="mt-2 flex items-center space-x-4">
								<!-- Quantity Input -->
								<label for="quantity-{item.product._id}" class="text-sm font-medium text-gray-600">
									Qty:
								</label>
								<input
									id={`quantity-${item.product._id}`}
									type="number"
									class="w-16 rounded border border-gray-300 p-1 text-center shadow-sm focus:ring focus:ring-blue-200"
									value={item.quantity}
									min="1"
									on:change={(e) =>
										handleUpdateQuantity(
											item.product._id,
											parseInt((e.target as HTMLInputElement).value)
										)}
								/>
							</div>
							<p class="mt-2 text-sm text-gray-800">
								<strong>Subtotal:</strong> ${item.subtotal.toFixed(2)}
							</p>
							{#if !item.isAvailable}
								<p class="mt-2 text-sm text-red-500">This item is currently unavailable.</p>
							{/if}
						</div>

						<!-- Delete Button -->
						<div class="ml-6">
							<button
								on:click={() => handleDeleteItem(item._id)}
								class="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 focus:outline-none focus:ring focus:ring-red-400"
								title="Remove Item"
								aria-label={`Remove ${item.product.name} from cart`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
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
										id={address._id}
										name="address"
										value={address._id}
										bind:group={selectedAddressId}
										class="text-blue-500 focus:ring-blue-400"
									/>
									<label for={address._id} class="text-gray-700">
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
							<label class="text-gray-700">Set as Default Address</label>
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
						<span>${cart.summary.subtotal.toFixed(2)}</span>
					</div>
					<div class="flex justify-between">
						<span>Tax:</span>
						<span>${cart.summary.tax.toFixed(2)}</span>
					</div>
					<div class="flex justify-between">
						<span>Shipping:</span>
						<span>${cart.summary.shipping.toFixed(2)}</span>
					</div>
					<hr class="my-2" />
					<div class="flex justify-between font-semibold">
						<span>Total:</span>
						<span>${cart.summary.total.toFixed(2)}</span>
					</div>
					<div class="flex justify-between">
						<span>Total Items:</span>
						<span>{cart.summary.totalItems}</span>
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
