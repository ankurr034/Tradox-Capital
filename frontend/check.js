const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users in DB. Creating admin.");
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { email: 'admin@laalstreet.com', name: 'Admin', password: hash, role: 'ADMIN' }
    });
  } else {
    console.log("Users exist: ", users.map(u => u.email));
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
