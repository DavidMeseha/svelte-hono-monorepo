import { Context } from 'hono';
import cartRepository from '../db/cartRepository.js';
import AppError from '../libs/app-error.js';
import { HttpStatus } from '../http-statuses.js';
import { summariesCart } from '../libs/utilities.js';

export async function addToCart(c: Context) {
	const { id } = c.get('user');
	const { productId, quantity } = await c.req.json();
	if (!productId) throw new AppError('Product Id is required', HttpStatus.BADREQUEST);

	const added = await cartRepository.addItem(id, productId, quantity || 1);
	return c.json({ success: true, item: added }, HttpStatus.CREATED);
}

export async function removeFromCart(c: Context) {
	const { id } = c.get('user');
	const { itemId } = await c.req.json();

	if (!itemId) throw new AppError('Product Id is required', HttpStatus.BADREQUEST);

	const removed = await cartRepository.removeItem(id, itemId);
	if (!removed) throw new AppError('Item not in cart', HttpStatus.CONFLICT);

	return c.json({ success: true, removed });
}

export async function getCartItems(c: Context) {
	const { id } = c.get('user');
	const items = await cartRepository.getItems(id);
	const summary = summariesCart(items);
	return c.json({ success: true, items, summary });
}

export async function clearCart(c: Context) {
	const { id } = c.get('user');
	await cartRepository.clear(id);
	return c.json({ success: true, message: 'user cart cleared' });
}

export async function updateCartItem(c: Context) {
	const { id } = c.get('user');
	const { itemId, quantity } = await c.req.json();
	if (!itemId || !quantity)
		throw new AppError('Product Id & item id is required', HttpStatus.BADREQUEST);
	const update = await cartRepository.updateItem(id, itemId, quantity);
	const summary = summariesCart(update.items);
	return c.json({ success: true, updatedItem: update.updated, items: update.items, summary });
}
