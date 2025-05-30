import { injectable, inject } from 'tsyringe'
import cron from 'node-cron'
import { SendNotification } from '@/application/notifications/SendNotification'
import * as console from 'node:console'

@injectable()
export class SendNotificationTask {
  constructor(@inject('SendNotification') private readonly sendNotification: SendNotification) {
    console.log('Initializing send notification task...')
    cron.schedule('0 * * * *', async () => {
      await this.execute()
    })
  }

  async execute(): Promise<void> {
    console.log('Executing send notification task...')
    await this.sendNotification.execute()
  }
}
