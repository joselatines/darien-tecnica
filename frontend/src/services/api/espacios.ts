import { handleApiError } from '../../shared/utils/errors'
import type { CreateEspacioDto, Espacio } from '../../types/espacios.interface'

import ApiService from './base'
import axios, { AxiosError } from 'axios'

export class EspaciosService extends ApiService {
  async getAll(): Promise<Espacio[]> {
    try {
      const url = `${this.API_URL}/espacios`
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'obtener la espaciociones')
      throw new Error(userMessage)
    }
  }
  async create(data: CreateEspacioDto) {
    try {
      const response = await axios.post(`${this.API_URL}/espacios`, data)
      return response
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'crear un espacio')
      throw new Error(userMessage)
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.API_URL}/espacios/${id}`)
      return response
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'eliminar un espacio')
      throw new Error(userMessage)
    }
  }
}
