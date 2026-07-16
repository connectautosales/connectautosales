require('dotenv').config({ path: '.env' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@connectautosales.com' },
    update: {},
    create: {
      email: 'admin@connectautosales.com',
      password: hashed,
      name: 'Admin',
    },
  })
  console.log('✅ Admin created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
