import { AvailableSlot } from '@/domain/availability/AvailableSlot'
import { DateTime } from 'luxon'

export class GetAvailableSlotsResponse {
  constructor(
    public readonly items: AvailableSlotDto[],
    public readonly total: number = items.length
  ) {}
}

export class AvailableSlotDto {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly tableNumber: number
  ) {}
}

export function toDto(availableSlots: AvailableSlot[]): GetAvailableSlotsResponse {
  return new GetAvailableSlotsResponse(
    availableSlots
      .sort((a, b) => a.from.getTime() - b.from.getTime())
      .map((slot) => {
        const from = DateTime.fromJSDate(slot.from, { zone: 'utc' }).setZone('Europe/Madrid').toFormat(ISO_FORMAT)
        const to = DateTime.fromJSDate(slot.to, { zone: 'utc' }).setZone('Europe/Madrid').toFormat(ISO_FORMAT)
        return new AvailableSlotDto(from!, to!, slot.tableNumber.value)
      })
  )
}

const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"
