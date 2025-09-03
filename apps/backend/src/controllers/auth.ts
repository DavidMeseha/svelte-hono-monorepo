import { Context } from 'hono';
import usersRepository from '../db/usersRepository.js';
import { HttpStatus } from '../http-statuses.js';
import AppError from '../libs/app-error.js';
import {
	comparePassword,
	generateAccessToken,
	hashPassword,
	verifyAccessToken
} from '../libs/utilities.js';

export async function register(c: Context) {
	const { name, email, password } = await c.req.json();
	console.log(name, email, password);

	if (!name || !email || !password)
		throw new AppError('all fields are required', HttpStatus.BADREQUEST);

	const hashedPassword = await hashPassword(password);

	const createdUser = await usersRepository.register(name, email, hashedPassword);
	if (!createdUser) throw new AppError('user already exists', HttpStatus.CONFLICT);

	return c.json({ success: true }, HttpStatus.CREATED);
}

export async function login(c: Context) {
	const { email, password } = await c.req.json();
	console.log(email, password);

	if (!email || !password) throw new AppError('all fields are required', HttpStatus.BADREQUEST);

	const user = await usersRepository.findByEmail(email);
	if (!user) throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);

	const isPasswordValid = await comparePassword(password, user.password);
	if (!isPasswordValid) throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);

	const accessToken = await generateAccessToken({ name: user.name || '', id: user.id });

	return c.json({ success: true, accessToken }, HttpStatus.OK);
}

export async function logout(c: Context) {
	return c.json({ success: true, message: 'User logged out' }, HttpStatus.OK);
}

export async function verify(c: Context) {
	const token = c.req.header('Authorization')?.split('Bearer ')[1];
	console.log(token);

	if (!token) {
		return c.json({ message: 'Unauthorized', success: false }, HttpStatus.UNAUTHORIZED);
	}

	try {
		const Payload = await verifyAccessToken(token);
		c.set('user', Payload);
		return c.json({ message: 'User authenticated', success: true }, HttpStatus.OK);
	} catch (err) {
		return c.json({ message: 'expired or invalid token', success: false }, HttpStatus.UNAUTHORIZED);
	}
}
