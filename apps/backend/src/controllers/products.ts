import { Context } from 'hono';
import productsRepository from '../db/productsRepository.js';
import { HttpStatus } from '../http-statuses.js';

export async function getAllProducts(c: Context) {
	const page = parseInt(c.req.query('page') || '1');
	const limit = parseInt(c.req.query('limit') || '8');
	const sort = c.req.query('sort');
	const maxPrice = parseInt(c.req.query('maxPrice') || '9999999');
	const minPrice = parseInt(c.req.query('minPrice') || '0');
	const category = c.req.query('category');
	const search = c.req.query('search') || '';

	console.log(page, sort, minPrice, maxPrice, category, search);

	if (
		sort !== undefined &&
		sort !== 'name' &&
		sort !== 'price' &&
		sort !== '-name' &&
		sort !== '-price'
	)
		return c.json({ message: 'wrong sort input', success: false }, HttpStatus.BADREQUEST);

	const resultProducts = await productsRepository.filterProducts({
		page,
		limit,
		sort,
		minPrice,
		maxPrice,
		category,
		search
	});

	return c.json(
		{
			products: resultProducts,
			metadata: {
				total: 1,
				page: 1,
				pages: 1
			},
			success: true
		},
		200
	);
}

export async function getProdutBySeName(c: Context) {
	const seName = c.req.param('seName');
	if (!seName) return c.json({ message: 'seName missing', success: false }, HttpStatus.BADREQUEST);

	const resultProduct = await productsRepository.bySeName(seName);

	if (!resultProduct)
		return c.json({ message: 'product not found', success: false }, HttpStatus.NOTFOUND);

	return c.json({ product: resultProduct, success: true });
}
