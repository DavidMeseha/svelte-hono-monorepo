<script>
	import Navbar from '$lib/components/Navbar.svelte'; // Import the Navbar component
	import '../app.css'; // Include global CSS styles
</script>

<svelte:head>
	<title>Ecom - Your One-Stop Shop</title>
	<!-- Global Tab Title -->
</svelte:head>

<!-- Global Layout -->
<div class="flex min-h-screen flex-col bg-gray-100">
	<!-- Navbar: Displayed on all pages -->
	<Navbar
		links={[
			{ name: 'Look up something', href: '/products' },
			{ name: 'My Orders', href: '/orders' }
		]}
	/>

	<!-- Page Content with fixed width -->
	<main class="flex-1 bg-gray-100 p-4">
		<div class="container mx-auto max-w-screen-2xl">
			<slot />
			<!-- Renders content of the current page -->
		</div>
	</main>
</div>
