import { CartItem, Product } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

const SALT = 12;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRITE_KEY || '');
const JWT_EXPIRATION = '2d';

type CartItemProduct = (CartItem & { product: Product })[];

export async function comparePassword(inputPassword: string, hashedPassword: string) {
	return await bcrypt.compare(inputPassword, hashedPassword);
}

export async function hashPassword(inputPassword: string) {
	return await bcrypt.hash(inputPassword, SALT);
}

export function generateAccessToken(payload: { name: string; id: string }) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(JWT_EXPIRATION)
		.setIssuedAt()
		.sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload as { name: string; id: string; iat: number; exp: number };
	} catch (error) {
		throw new Error('expired or invalid token');
	}
}

export function summariesCart(
	items: CartItemProduct,
	taxRate: number = 0.07,
	shipping: number = 5
) {
	const itemsStats = items.reduce(
		(acc, item) => ({
			subTotal: acc.subTotal + item.quantity * (item.product.price as any),
			totalItems: acc.totalItems + item.quantity
		}),
		{ subTotal: 0, totalItems: 0 }
	);
	const tax = (itemsStats.subTotal * taxRate).toFixed(2);
	const total = itemsStats.subTotal + itemsStats.subTotal * taxRate + shipping;

	return {
		subTotal: itemsStats.subTotal,
		tax,
		shipping,
		total,
		totalItems: itemsStats.totalItems
	};
}
