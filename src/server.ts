import 'reflect-metadata'
import { container } from 'tsyringe'
import { buildApp } from './app'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

export const app = buildApp()

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})

// Start background tasks
container.resolve<SendNotificationTask>('SendNotificationTask')
