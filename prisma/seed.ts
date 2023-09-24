import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=========== Creating Users ===========');

  await prisma.user.create({
    data: {
      name: 'テストユーザー',
      email: 'test@test.com',
      password: bcrypt.hashSync('password', 10),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
