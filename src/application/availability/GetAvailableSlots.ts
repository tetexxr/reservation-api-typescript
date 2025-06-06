import { inject, injectable } from 'tsyringe'
import { AvailableSlot } from '@/domain/availability/AvailableSlot'
import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { TableRepository } from '@/domain/tables/TableRepository'
import { GetAvailableSlotsQuery } from './GetAvailableSlotsQuery'

@injectable()
export class GetAvailableSlots {
  private static readonly SLOT_DURATION = 15
  private static readonly OPENING_HOUR = 8
  private static readonly CLOSING_HOUR = 14

  constructor(
    @inject('TableRepository') private readonly tableRepository: TableRepository,
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository
  ) {}

  async execute(query: GetAvailableSlotsQuery): Promise<AvailableSlot[]> {
    const tables = (await this.tableRepository.findAll())
      .filter((table) => table.isSuitableForPartySize(query.partySize))
      .sort((a, b) => a.number.value - b.number.value)
    const reservationTables = await this.reservationTableRepository.findAll()
    const reservationTableValues = new Map([...reservationTables].map((entry) => [entry[0].value, entry[1].value]))
    const reservations = (await this.reservationRepository.findAll())
      .filter((reservation) => {
        const reservationDate = new Date(reservation.time)
        const queryDate = new Date(query.date)
        return (
          reservationDate.getFullYear() === queryDate.getFullYear() &&
          reservationDate.getMonth() === queryDate.getMonth() &&
          reservationDate.getDate() === queryDate.getDate()
        )
      })
      .filter((reservation) => {
        const tableNumber = reservationTableValues.get(reservation.id.value)
        return tableNumber !== undefined && tables.some((table) => table.number.value === tableNumber)
      })
      .sort((a, b) => a.time.getTime() - b.time.getTime())

    const opening = new Date(query.date)
    opening.setHours(GetAvailableSlots.OPENING_HOUR, 0, 0, 0)
    const closing = new Date(query.date)
    closing.setHours(GetAvailableSlots.CLOSING_HOUR, 0, 0, 0)
    const availableSlots: AvailableSlot[] = []

    for (const table of tables) {
      let slotTime = new Date(opening)
      while (new Date(slotTime.getTime() + GetAvailableSlots.SLOT_DURATION * 60_000) <= closing) {
        const slotEndTime = new Date(slotTime.getTime() + GetAvailableSlots.SLOT_DURATION * 60_000)
        const slotFilter = (reservation: Reservation): boolean => {
          const tableNumber = reservationTableValues.get(reservation.id.value)
          return (
            slotTime < reservation.getEndTime() &&
            slotEndTime > reservation.time &&
            tableNumber !== undefined &&
            tableNumber === table.number.value
          )
        }
        const isSlotAvailable = !reservations.some(slotFilter)
        if (isSlotAvailable) {
          availableSlots.push(new AvailableSlot(slotTime, slotEndTime, query.partySize, table.number))
          slotTime = slotEndTime
        } else {
          const endTime = reservations.find(slotFilter)!.getEndTime()
          slotTime = endTime
        }
      }
    }

    return availableSlots
  }
}
