<script>
	export let item;
	export let removeFromCart;
</script>

<div class="flex items-center justify-between border-b p-4">
	<div>
		<h3 class="font-bold">{item.name}</h3>
		<p>Quantity: {item.quantity}</p>
	</div>
	<button class="text-red-500 hover:underline" on:click={() => removeFromCart(item.id)}>
		Remove
	</button>
</div>
