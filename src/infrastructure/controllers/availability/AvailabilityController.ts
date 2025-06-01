import { inject, injectable } from 'tsyringe'
import { FastifyInstance } from 'fastify'
import { GetAvailableSlots } from '@/application/availability/GetAvailableSlots'
import { GetAvailableSlotsResponse, toDto } from './GetAvailableSlotsResponse'

@injectable()
export class AvailabilityController {
  constructor(@inject('GetAvailableSlots') private readonly getAvailableSlots: GetAvailableSlots) {}

  registerRoutes(fastify: FastifyInstance): void {
    fastify.get<{ Querystring: { date: string; partySize: string } }>(
      '/v1/availability',
      async (request): Promise<GetAvailableSlotsResponse> => {
        const { date, partySize } = request.query
        const availableSlots = await this.getAvailableSlots.execute({
          date: new Date(date),
          partySize: parseInt(partySize)
        })
        return toDto(availableSlots)
      }
    )
  }
}
