import { handleApiError } from '../../shared/utils/errors'
import type { CreateReservaDto, GetReservasApiResponse } from '../../types/reservaciones.interface'
import ApiService from './base'
import axios, { AxiosError } from 'axios'

export class ReservacionesService extends ApiService {
  async getAll(page = 1, perPage = 10): Promise<GetReservasApiResponse> {
    try {
      const url = `${this.API_URL}/reservas?page=${page}&perPage=${perPage}`
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'obtener las reservaciones')
      throw new Error(userMessage)
    }
  }
  async create(data: CreateReservaDto) {
    try {
      const response = await axios.post(`${this.API_URL}/reservas`, data)
      return response
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'crear una reserva')
      throw new Error(userMessage)
    }
  }

  async delete(id: string): Promise<any> {
    try {
      // update status to cancelled instead of deleting to preserve history
      const response = await axios.patch(`${this.API_URL}/reservas/${id}`, { status: 'cancelled' })
      return response
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'eliminar una reserva')
      throw new Error(userMessage)
    }
  }
}
