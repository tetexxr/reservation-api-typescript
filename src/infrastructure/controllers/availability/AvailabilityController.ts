import { injectable, inject } from 'tsyringe'
import { FastifyInstance } from 'fastify'
import { GetAvailableSlots } from '@/application/availability/GetAvailableSlots'
import { GetAvailableSlotsQuery } from '@/application/availability/GetAvailableSlotsQuery'
import { GetAvailableSlotsResponse, toDto } from './GetAvailableSlotsResponse'

@injectable()
export class AvailabilityController {
  constructor(@inject('GetAvailableSlots') private readonly getAvailableSlots: GetAvailableSlots) {}

  registerRoutes(fastify: FastifyInstance): void {
    fastify.get<{ Querystring: { date: string; partySize: number } }>(
      '/v1/availability',
      async (request, reply): Promise<GetAvailableSlotsResponse> => {
        const { date, partySize } = request.query
        const query = new GetAvailableSlotsQuery(new Date(date), partySize)
        const availableSlots = await this.getAvailableSlots.execute(query)
        reply.send(toDto(availableSlots))
        return toDto(availableSlots)
      }
    )
  }
}
