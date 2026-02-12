import { db } from './index';
import { users } from './schema';
import { hash } from 'bcryptjs';

async function seed() {
    console.log('Seeding data...');

    const hashedPassword = await hash('password123', 10);

    await db.insert(users).values({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Главный Кот',
        role: 'admin'
    }).onConflictDoUpdate({
        target: users.email,
        set: {
            password: hashedPassword,
            name: 'Главный Кот',
            role: 'admin'
        }
    });

    console.log('Default user created: admin@example.com / password123');

    console.log('Done!');
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
