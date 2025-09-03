<script lang="ts">
	import type { CartItem } from '$lib/types';

	export let item: CartItem;
	export let handleUpdateQuantity: (itemId: string, q: number) => void;
	export let handleDeleteItem: (itemId: string) => void;
</script>

<div
	class="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg"
>
	<!-- Product Image -->
	<div class="flex-shrink-0">
		{#if item.product.image}
			<img
				src={item.product.image}
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
			<strong>Price:</strong> ${item.product.price}
		</p>
		<div class="mt-2 flex items-center space-x-4">
			<!-- Quantity Input -->
			<label for="quantity-{item.product.id}" class="text-sm font-medium text-gray-600">
				Qty:
			</label>
			<input
				id={`quantity-${item.product.id}`}
				type="number"
				class="w-16 rounded border border-gray-300 p-1 text-center shadow-sm focus:ring focus:ring-blue-200"
				value={item.quantity}
				min="1"
				on:change={(e) => {
					handleUpdateQuantity(item.id, parseInt((e.target as HTMLInputElement)?.value));
				}}
			/>
		</div>
		<p class="mt-2 text-sm text-gray-800">
			<strong>Subtotal:</strong> ${item.product.price * item.quantity}
		</p>
		<!-- {#if !item.isAvailable}
								<p class="mt-2 text-sm text-red-500">This item is currently unavailable.</p>
							{/if} -->
	</div>

	<!-- Delete Button -->
	<div class="ml-6">
		<button
			on:click={() => handleDeleteItem(item.id)}
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
