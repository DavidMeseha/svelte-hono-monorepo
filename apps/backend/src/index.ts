import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';
import { fileURLToPath } from 'url';
import { cors } from 'hono/cors';
import { routes } from './routes/index.js';
import { createProduct } from './db/createProduct.js';
import { products } from './db/products-setup.js';

const app = new Hono();

app.use(
	'/*',
	cors({
		origin: process.env.ORIGIN ?? ''
	})
);

app.use(
	'/*',
	serveStatic({
		root: path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')
	})
);

app.get('/init', async (c) => {
	const x = await createProduct(products[0]);
	const y = await createProduct(products[1]);
	return c.json({ products: [{ ...x }, { ...y }] });
});

app.route('/api', routes);

const port = parseInt(process.env.PORT || '3000');
serve({ fetch: app.fetch, port }, (info) => {
	console.log(`Server running at http://localhost:${info.port}`);
	console.info(info);
});

export default app;
