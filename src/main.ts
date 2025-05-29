import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import env from '@fastify/env'

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config',
  schema,
  dotenv: true
}

export const build = async () => {
  const app = fastify({
    logger: true
  })

  await app.register(env, options)
  await app.register(cors, {
    origin: true
  })
  await app.register(swagger, {
    swagger: {
      info: {
        title: 'Reservation API',
        description: 'API for managing restaurant reservations',
        version: '1.0.0'
      }
    }
  })
  await app.register(swaggerUi, {
    routePrefix: '/docs'
  })

  return app
}
