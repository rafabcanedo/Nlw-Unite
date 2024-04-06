import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// PageIndex is string, because querystring only accept string

export async function getEventMembers(app: FastifyInstance) {
 app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId/members', {
    schema: {
     summary: 'Get events members',
     tags: ['events'],
     params: z.object({
        eventId: z.string().uuid(),
     }),
     querystring: z.object({
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default('0').transform(Number),
     }),
     response: {
      200: z.object({
       members: z.array(
        z.object({
         id: z.number(),
         name: z.string(),
         email: z.string().email(),
         createdAt: z.date(),
         checkedInAt: z.date().nullable(),
        })
       )
      }),
     },
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { pageIndex, query } = request.query

    const members = await prisma.member.findMany({
     select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      checkIn: {
       select: {
        createdAt: true,
       }
      }
     },
     where: query ? {
        eventId,
        name: {
         contains: query,
        }
     } : {
        eventId,
     },
     take: 10,
     skip: pageIndex * 10, // pagination schema
     orderBy: {
        createdAt: 'desc'
     }
    })

    return reply.send({
     members: members.map(member => {
      return {
      id: member.id,
      name: member.name,
      email: member.email,
      createdAt: member.createdAt,
      checkedInAt: member.checkIn?.createdAt ?? null,
      }
     })
    })
 })
}

// return reply.send({ event })

// Lógica Where (linha 38)
// Condição => se existir uma busca (query) vamos buscar por name e eventId
// Se não buscamos apenas o eventId
// contains => buscar contendo uma tal influência