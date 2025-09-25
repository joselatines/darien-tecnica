import { localStorageKeys } from '../../lib/constants'
import { handleApiError } from '../../shared/utils/errors'
import ApiService from './base'
import axios, { AxiosError } from 'axios'

export class AuthService extends ApiService {
  async login(email: string) {
    try {
      const url = `${this.API_URL}/auth/login`
      const response = await axios.post(url, { email })
      localStorage.setItem(localStorageKeys.apiKey, response.data.apiKey)
      localStorage.setItem(localStorageKeys.clientId, response.data.id)

      return response.data
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'iniciar sesión')
      throw new Error(userMessage)
    }
  }
  async register(email: string) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/register`, { email })

      localStorage.setItem(localStorageKeys.apiKey, response.data.apiKey)
      localStorage.setItem(localStorageKeys.clientId, response.data.id)
      return response
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'registrar un usuario')
      throw new Error(userMessage)
    }
  }

  async logout(): Promise<any> {
    try {
      localStorage.removeItem(localStorageKeys.apiKey)
      localStorage.removeItem(localStorageKeys.role)
      localStorage.removeItem(localStorageKeys.clientId)
      return true
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'cerrar sesión')
      throw new Error(userMessage)
    }
  }

  async loginAsAdmin() {
    try {
      const data = await this.login('admin@gmail.com')

      localStorage.setItem(localStorageKeys.apiKey, data.apiKey)
      localStorage.setItem(localStorageKeys.role, 'true')
    } catch (error) {
      const userMessage = handleApiError(error as AxiosError, 'cerrar sesión')
      throw new Error(userMessage)
    }
  }
}
