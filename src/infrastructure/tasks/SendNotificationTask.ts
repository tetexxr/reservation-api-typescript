import cron from 'node-cron'
import { SendNotification } from '@/application/notifications/SendNotification'

export class SendNotificationTask {
  constructor(private readonly sendNotification: SendNotification) {
    cron.schedule('0 * * * *', async () => {
      await this.execute()
    })
  }

  async execute(): Promise<void> {
    await this.sendNotification.execute()
  }
}
