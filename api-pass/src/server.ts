import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { checkIn } from "./routes/check-in";
import { getEventMembers } from "./routes/get-event-members";

export const app = fastify()

app.register(fastifySwagger, {
  swagger: {
   consumes: ['application/json'],
   produces: ['application/json'],
   info: {
    title: 'pass.in',
    description: 'Especificações da API para o back-end da aplicação contruída no evento NLW Unite.',
    version: '1.0.0'
   },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(checkIn)
app.register(getEventMembers)


app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server runing! 📩")
})