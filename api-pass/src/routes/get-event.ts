import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
 app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId', {
    schema: {
     params: z.object({
        eventId: z.string().uuid(),
     }),
     response: {
      200: {
        event: z.object({
          id: z.string().uuid(),
          title: z.string(),
          slug: z.string(),
          details: z.string().nullable(),
          maximumMembers: z.number().int().nullable(),
          membersAmount: z.number().int(),
        })
      },
     },
    }
  }, async (request, reply) => {
    const { eventId } = request.params

    const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumMembers: true,
          _count: {
            select: {
              members: true,
            }
          },
        },
        where: {
         id: eventId,
        }
    })

    if (event === null) {
     throw new Error('Event not found.')
    }

  return reply.send({
    event: {
      id: event.id,
      title: event.title,
      slug: event.slug,
      details: event.details,
      maximumMembers: event.maximumMembers,
      membersAmount: event._count.members,
    },
  })
 })
}

// return reply.send({ event })