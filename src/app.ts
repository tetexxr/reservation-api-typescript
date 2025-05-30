import { container } from 'tsyringe'
import 'reflect-metadata'
import './container'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import env from '@fastify/env'
import { AvailabilityController } from '@/infrastructure/controllers/availability/AvailabilityController'
import { ReservationController } from '@/infrastructure/controllers/reservations/ReservationController'

export const buildApp = () => {
  const app = Fastify({
    logger: true
  })

  app.register(env, options)
  app.register(cors, {
    origin: true
  })
  app.register(swagger, {
    swagger: {
      info: {
        title: 'Reservation API',
        description: 'API for managing restaurant reservations',
        version: '1.0.0'
      }
    }
  })
  app.register(swaggerUi, {
    routePrefix: '/docs'
  })

  // Register routes
  container.resolve<AvailabilityController>('AvailabilityController').registerRoutes(app)
  container.resolve<ReservationController>('ReservationController').registerRoutes(app)

  return app
}

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
