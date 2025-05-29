import { FastifyInstance } from 'fastify'
import { GetAvailableSlots } from '@/application/availability/GetAvailableSlots'
import { GetAvailableSlotsQuery } from '@/application/availability/GetAvailableSlotsQuery'
import { GetAvailableSlotsResponse, toDto } from './GetAvailableSlotsResponse'

export class AvailabilityController {
  constructor(private readonly getAvailableSlots: GetAvailableSlots) {}

  registerRoutes(fastify: FastifyInstance): void {
    fastify.get<{ Querystring: { date: string; partySize: number } }>(
      '/v1/availability',
      async (request): Promise<GetAvailableSlotsResponse> => {
        const { date, partySize } = request.query
        const query = new GetAvailableSlotsQuery(new Date(date), partySize)
        const availableSlots = await this.getAvailableSlots.execute(query)
        return toDto(availableSlots)
      }
    )
  }
}
