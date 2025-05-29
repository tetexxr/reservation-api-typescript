import { injectable, inject } from 'tsyringe'
import cron from 'node-cron'
import { SendNotification } from '@/application/notifications/SendNotification'

@injectable()
export class SendNotificationTask {
  constructor(@inject('SendNotification') private readonly sendNotification: SendNotification) {
    cron.schedule('0 * * * *', async () => {
      await this.execute()
    })
  }

  async execute(): Promise<void> {
    await this.sendNotification.execute()
  }
}
