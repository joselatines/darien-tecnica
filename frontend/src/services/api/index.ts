import { AuthService } from './auth'
import { EspaciosService } from './espacios'
import { ReservacionesService } from './reservas'

export const api = {
  auth: new AuthService(),
  reservaciones: new ReservacionesService(),
  espacios: new EspaciosService()
}
