import { AvailableSlot } from '@/domain/availability/AvailableSlot'
import { DateTime } from 'luxon'

export type GetAvailableSlotsResponse = {
  items: AvailableSlotDto[]
  total: number
}

export type AvailableSlotDto = {
  from: string
  to: string
  tableNumber: number
}

export function toDto(availableSlots: AvailableSlot[]): GetAvailableSlotsResponse {
  return {
    items: availableSlots
      .sort((a, b) => a.from.getTime() - b.from.getTime())
      .map((slot) => {
        const from = DateTime.fromJSDate(slot.from, { zone: 'utc' }).toLocal().toFormat(ISO_FORMAT)
        const to = DateTime.fromJSDate(slot.to, { zone: 'utc' }).toLocal().toFormat(ISO_FORMAT)
        return {
          from: from!,
          to: to!,
          tableNumber: slot.tableNumber.value
        }
      }),
    total: availableSlots.length
  }
}

const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"
