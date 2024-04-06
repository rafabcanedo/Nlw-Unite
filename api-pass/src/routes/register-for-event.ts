import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app
     .withTypeProvider<ZodTypeProvider>()
     .post('/events/:eventId/members', {
        schema: {
         body: z.object({
         name: z.string().min(4),
         email: z.string().email(),
        }),
        params: z.object({
         eventId: z.string().uuid(),
        }),
        response: {
         201: z.object({
          memberId: z.number(),
         })
        },
        }
     }, async (request, reply) => {
        const { eventId } = request.params
        const { name, email } = request.body

        // Validate uniqueness eventId and email
        const memberFromEmail = await prisma.member.findUnique({
         where: {
            eventId_email: {
               email,
               eventId
            }
         }
        })

        if (memberFromEmail !== null) {
         throw new Error('This email is already registered for this event.')
        }

        // Get many functions with await (Promise)
        const [ event, amountOfMembersForEvent ] = await Promise.all([
         prisma.event.findUnique({
            where: {
               id: eventId,
            }
           }),

           prisma.member.count({
            where: {
               eventId,
            }
           })
        ])

        // const event = await 

        // const amountOfMembersForEvent = await 

        if (event?.maximumMembers && amountOfMembersForEvent >= event.maximumMembers) {
         throw new Error('The maximum number of members for this even has been reached.')
        }

        const member = await prisma.member.create({
         data: {
          name,
          email,
          eventId,
         }
        })

        return reply.status(201).send({ memberId: member.id })
     })
}