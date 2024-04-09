import { Prisma } from "@prisma/client";
import { faker } from '@faker-js/faker'
import { prisma } from "../src/lib/prisma";
import dayjs from 'dayjs'

async function seed() {
 const eventId ="04b1b1ec-65e2-4d8e-84b8-5212b3239114"

 await prisma.event.deleteMany()

 await prisma.event.create({
  data: {
   id: eventId,
   title: 'Unite Summit',
   slug: 'unite-summit',
   details: 'Um evento bla bla bla bla',
   maximumMembers: 120,
  }
 })

 const membersToInsert: Prisma.MemberUncheckedCreateInput[] = []

  for (let i = 0; i <= 120; i++) {
    membersToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }),
      checkIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutMemberInput | undefined>([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          }
        }
      ])
    })
  }

  await Promise.all(membersToInsert.map(data => {
    return prisma.member.create({
      data,
    })
  }))
}

seed().then(() => {
 console.log('Database seeded!')
 prisma.$disconnect()
})