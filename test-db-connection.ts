import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Count records
    const userCount = await prisma.user.count();
    const scholarshipCount = await prisma.scholarship.count();
    const applicationCount = await prisma.application.count();

    console.log('📊 Database Statistics:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Scholarships: ${scholarshipCount}`);
    console.log(`  Applications: ${applicationCount}\n`);

    // Sample query - Get all users with their roles
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        status: true,
      },
      orderBy: {
        role: 'asc',
      },
    });

    console.log('👥 Users in database:');
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.role}) - ${user.status}`);
    });

    console.log('\n🎓 Scholarships:');
    const scholarships = await prisma.scholarship.findMany({
      select: {
        title: true,
        amount: true,
        status: true,
        deadline: true,
      },
    });

    scholarships.forEach((scholarship) => {
      const amount = Number(scholarship.amount).toLocaleString('vi-VN');
      console.log(`  - ${scholarship.title}`);
      console.log(`    Amount: ${amount} VND`);
      console.log(`    Status: ${scholarship.status}`);
      console.log(
        `    Deadline: ${scholarship.deadline.toLocaleDateString('vi-VN')}`,
      );
    });

    console.log('\n✅ All tests passed! Database is working correctly!\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
