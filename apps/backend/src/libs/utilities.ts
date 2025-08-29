import bcrypt from 'bcrypt';
import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

const SALT = 12;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRITE_KEY || '');
const JWT_EXPIRATION = '2h';

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
		console.error('JWT verification error:', error);
		return null;
	}
}
