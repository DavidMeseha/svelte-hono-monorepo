import { Context } from 'hono';
import usersRepository from '../db/usersRepository.js';
import { User } from '@prisma/client';
import { HttpStatus } from '../http-statuses.js';

export async function details(c: Context) {
	const user: User = c.get('user');
	const userFromDatabase = await usersRepository.findById(user.id);
	return c.json({ user: userFromDatabase, success: true }, HttpStatus.OK);
}
