import { container } from 'tsyringe'
import 'reflect-metadata'
import './container'
import fastify from 'fastify'
import cors from '@fastify/cors'
import { AvailabilityController } from '@/infrastructure/controllers/availability/AvailabilityController'
import { ReservationController } from '@/infrastructure/controllers/reservations/ReservationController'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

const app = fastify({
  logger: true
})
app.register(cors, {
  origin: true
})

app.get('/health', async () => {
  return { status: 'ok' }
})

// Register routes
container.resolve(AvailabilityController).registerRoutes(app)
container.resolve(ReservationController).registerRoutes(app)

// Start background tasks
container.resolve(SendNotificationTask)

export default app
