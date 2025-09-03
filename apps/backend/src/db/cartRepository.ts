import { db } from './db.js';

class CartRepository {
	async addItem(userId: string, productId: string, quantity: number) {
		let cart = await db.cart.findUnique({ where: { userId } });
		if (!cart) cart = await db.cart.create({ data: { userId } });

		const existingItem = await db.cartItem.findUnique({
			where: { cartId_productId: { cartId: cart.id, productId } }
		});

		if (existingItem) {
			return db.cartItem.update({
				where: { cartId_productId: { cartId: cart.id, productId } },
				data: { quantity: existingItem.quantity + (quantity || 1) }
			});
		} else {
			return db.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					quantity: quantity || 1
				}
			});
		}
	}

	async updateItem(userId: string, itemId: string, quantity: number) {
		const cart = await db.cart.findUnique({ where: { userId } });
		if (!cart) throw new Error('no cart found');

		const [updated, cartItems] = await Promise.all([
			db.cartItem.update({
				where: { cartId: cart.id, id: itemId },
				data: { quantity }
			}),
			db.cartItem.findMany({
				where: { cartId: cart.id },
				include: { product: true }
			})
		]);

		return {
			items: cartItems || [],
			updated
		};
	}

	async removeItem(userId: string, itemId: string) {
		const cart = await db.cart.findUnique({ where: { userId } });
		if (!cart) throw new Error('no cart found');

		return db.cartItem.delete({
			where: { cartId: cart.id, id: itemId }
		});
	}

	async getItems(userId: string) {
		const cart = await db.cart.findUnique({ where: { userId } });
		if (!cart) return [];
		return db.cartItem.findMany({
			where: { cartId: cart.id },
			include: { product: true }
		});
	}

	async clear(userId: string) {
		const cart = await db.cart.findUnique({ where: { userId } });
		if (!cart) return;

		return db.cartItem.deleteMany({
			where: { cartId: cart.id }
		});
	}
}

const cartRepository = new CartRepository();
export default cartRepository;
