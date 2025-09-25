import type { ReservacionStatus } from '../../types/reservaciones.interface'

export const getReservacionStatusColor = (status: ReservacionStatus) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-success'
    case 'pending':
      return 'bg-warning'
    case 'cancelled':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}
