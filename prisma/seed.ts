import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Pesca & Mordomia',
      description: 'Pesca lala'

    },
  })
  console.log(settings)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
