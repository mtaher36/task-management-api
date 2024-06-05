// seed.js
import prisma from '../config/database.js';

async function main() {
  await prisma.role.createMany({
    data: [{ name: 'user' }, { name: 'admin' }],
    skipDuplicates: true,
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
