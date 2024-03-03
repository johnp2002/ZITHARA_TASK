const { PrismaClient } = require('@prisma/client');
const casual = require('casual');

const prisma = new PrismaClient();

async function main() {
  try {
    for (let i = 0; i < 50; i++) {
      await prisma.customer.create({
        data: {
          name: casual.name,
          age: casual.integer(18, 80),
          phone: casual.phone,
          location: casual.city,
          createdAt: casual.moment
        }
      });
    }
    console.log('50 records created successfully.');
  } catch (error) {
    console.error('Error creating records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
