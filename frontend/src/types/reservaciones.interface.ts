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

export interface GetReservasApiResponse {
  data: Reserva[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export interface CreateReservaDto {
  /**
   * The id of the espacio
   * @example '6165161'
   */
  espacioId: string

  /**
   * The id of the client
   * @example '6165161'
   */
  clientId: string

  /**
   * The date of the reservation ISO 8601 format YYYY-MM-DD
   * @example '2002-11-13'
   */
  reservationDate: Date

  /**
   * The start time of the reservation in HH:mm (24 hours format)
   * @example '01:30'
   */
  startTime: string

  /**
   * The end time of the reservation in HH:mm (24 hours format)
   * @example '02:30'
   */
  endTime: string

  /**
   * The status of the reservation
   * @example 'confirmed'
   */
  status: ReservacionStatus
}
