import { injectable, inject } from 'tsyringe'
import { FastifyInstance } from 'fastify'
import { CreateReservation } from '@/application/reservations/CreateReservation'
import { CancelReservation } from '@/application/reservations/CancelReservation'
import { CancelReservationCommand } from '@/application/reservations/CancelReservationCommand'
import { UpdateReservation } from '@/application/reservations/UpdateReservation'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { CreateReservationRequest } from './CreateReservationRequest'
import { UpdateReservationRequest } from './UpdateReservationRequest'
import { GetReservationsResponse, toDto } from './GetReservationsResponse'
import { CreateReservationResponse } from '@/infrastructure/controllers/reservations/CreateReservationResponse'

@injectable()
export class ReservationController {
  constructor(
    @inject('CreateReservation') private readonly createReservation: CreateReservation,
    @inject('UpdateReservation') private readonly updateReservation: UpdateReservation,
    @inject('CancelReservation') private readonly cancelReservation: CancelReservation,
    @inject('ReservationRepository') private readonly repository: ReservationRepository
  ) {}

  registerRoutes(fastify: FastifyInstance): void {
    fastify.post<{
      Body: CreateReservationRequest
    }>('/v1/reservations', async (request, reply): Promise<CreateReservationResponse> => {
      const command = request.body.toCommand()
      const id = await this.createReservation.execute(command)
      return reply.code(201).send({ reservationId: id.value })
    })

    fastify.put<{
      Params: { reservationId: string }
      Body: UpdateReservationRequest
    }>('/v1/reservations/:reservationId', async (request, reply) => {
      const command = request.body.toCommand(new ReservationId(request.params.reservationId))
      await this.updateReservation.execute(command)
      return reply.code(204).send()
    })

    fastify.delete<{
      Params: { reservationId: string }
    }>('/v1/reservations/:reservationId', async (request, reply) => {
      const command = new CancelReservationCommand(new ReservationId(request.params.reservationId))
      await this.cancelReservation.execute(command)
      return reply.code(204).send()
    })

    fastify.get<{
      Querystring: { name?: string }
    }>('/v1/reservations', async (request): Promise<GetReservationsResponse> => {
      const reservations = await this.repository.findAll(request.query.name)
      return toDto(reservations)
    })
  }
}
