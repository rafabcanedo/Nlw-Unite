import { prisma } from "../src/lib/prisma";

async function seed() {
 await prisma.event.create({
  data: {
   id: '04b1b1ec-65e2-4d8e-84b8-5212b3239114',
   title: 'Unite Summit',
   slug: 'unite-summit',
   details: 'Um evento bla bla bla bla',
   maximumMembers: 120,
  }
 })
}

seed().then(() => {
 console.log('Database seeded!')
 prisma.$disconnect()
})