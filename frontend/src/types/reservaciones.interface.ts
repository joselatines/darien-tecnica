export type ReservacionStatus = 'confirmed' | 'pending' | 'cancelled'

export interface Reserva {
  id: string
  espacioId: string
  clientId: string
  reservationDate: Date // ISO format 2024-01-15
  startTime: string // "01:30" format
  endTime: string // "01:30" format
  createdAt: Date
  updatedAt: Date
  status: ReservacionStatus
}
