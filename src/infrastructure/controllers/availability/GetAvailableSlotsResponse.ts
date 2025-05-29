import { AvailableSlot } from '@/domain/availability/AvailableSlot'

export class GetAvailableSlotsResponse {
  constructor(
    public readonly items: AvailableSlotDto[],
    public readonly total: number = items.length
  ) {}
}

export class AvailableSlotDto {
  constructor(
    public readonly from: Date,
    public readonly to: Date,
    public readonly tableNumber: number
  ) {}
}

export function toDto(availableSlots: AvailableSlot[]): GetAvailableSlotsResponse {
  return new GetAvailableSlotsResponse(
    availableSlots.map((slot) => new AvailableSlotDto(slot.from, slot.to, slot.tableNumber.value))
  )
}
