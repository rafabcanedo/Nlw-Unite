import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
 app
  .withTypeProvider<ZodTypeProvider>()
  .get('/members/:memberId/check-in', {
    schema: {
     summary: 'Check-in a member',
     tags: ['check-ins'],
     params: z.object({
      memberId: z.coerce.number().int()
     }),
     response: {
      201: z.null(),
     }
    }
  }, async (request, reply) => {
    const { memberId } = request.params

    const memberCheckIn = await prisma.checkIn.findUnique({
     where: {
        memberId,
     }
    })

    if (memberCheckIn !== null) {
     throw new Error('Member already checked in.')
    }

    await prisma.checkIn.create({
     data: {
        memberId,
     }
    })

    return reply.status(201).send()
  })
}