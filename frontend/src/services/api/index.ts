import { EspaciosService } from './espacios'
import { ReservacionesService } from './reservas'

export const api = {
  reservaciones: new ReservacionesService(),
  espacios: new EspaciosService()
}
