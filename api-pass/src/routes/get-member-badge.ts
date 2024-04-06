import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getMemberBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/members/:memberId/badge', {
      schema: {
        summary: 'Get an member badge',
        tags: ['members'],
        params: z.object({
          memberId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            })
          })
        },
      }
    }, async (request, reply) => {
      const { memberId } = request.params

      const member = await prisma.member.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: memberId,
        }
      })

      if (member === null) {
        throw new BadRequest('Member not found.')
      }

      // BaseURL and CheckInURL definition
      const baseURL = `${request.protocol}://${request.hostname}`

      const checkInURL = new URL(`/members/${memberId}/check-in`, baseURL)

      return reply.send({
        badge: {
          name: member.name,
          email: member.email,
          eventTitle: member.event.title,
          checkInURL: checkInURL.toString(),
        }
      })
    })
}