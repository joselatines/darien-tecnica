import { handleApiError } from '../../shared/utils/errors'
import type { Reserva } from '../../types/reservaciones.interface'
import ApiService from './base'
import axios, { AxiosError } from 'axios'

interface Reservas {
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

export class ReservacionesService extends ApiService {
  async getAll(page = 1, perPage = 10): Promise<Reservas> {
    try {
      const url = `${this.API_URL}/reservas?page=${page}&perPage=${perPage}`
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'obtener las reservaciones')
      throw new Error(userMessage)
    }
  }
}
