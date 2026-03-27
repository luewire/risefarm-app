import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('RiseFarmbebas2026', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { passwordHash: hash }, // FORCE UPDATE
    create: { username: 'admin', passwordHash: hash }
  })
  console.log("Admin password updated successfully!")
}

main().finally(() => prisma.$disconnect())
