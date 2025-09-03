<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import '../app.css';

	onMount(async () => {
		await authStore.initialize();
	});
</script>

<svelte:head>
	<title>Ecom - Your One-Stop Shop</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-100">
	<Navbar />

	<main class="flex-1 bg-gray-100 p-4">
		<div class="container mx-auto max-w-screen-2xl">
			<slot />
		</div>
	</main>
</div>
