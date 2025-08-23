import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { routes } from './routes/index.js';
import { createProduct } from './db/createProduct.js';
import { products } from './db/products-setup.js';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(
	'/*',
	cors({
		origin: process.env.ORIGIN ?? ''
	})
);

app.use('*', logger());
app.use('/images/*', serveStatic({ root: './public' }));

app.get('/init', async (c) => {
	const x = await createProduct(products[0]);
	const y = await createProduct(products[1]);
	return c.json({ products: [{ ...x }, { ...y }] });
});

app.route('/api', routes);

app.notFound((c) => {
	return c.json({ error: 'Route not found' }, 404);
});

export default app;
