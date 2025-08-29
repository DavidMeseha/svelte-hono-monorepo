import { db } from './db.js';

class UsersRepository {
	async register(name: string, email: string, password: string) {
		return await db.user.create({
			data: {
				name,
				email,
				password
			}
		});
	}

	async findByEmail(email: string) {
		return await db.user.findUnique({
			where: { email }
		});
	}
}

const usersRepository = new UsersRepository();
export default usersRepository;
