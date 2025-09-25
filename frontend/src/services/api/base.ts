import axios from 'axios'
import { localStorageKeys } from '../../lib/constants'

// Configure Axios interceptors
axios.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem(localStorageKeys.apiKey)
    if (apiKey) {
      config.headers['x-api-key'] = apiKey
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

class ApiService {
  protected readonly API_URL = import.meta.env.VITE_API_URL
  async getAll(): Promise<any> {}
  async create(data: any): Promise<any> {
    return data
  }
  async delete(id: string): Promise<any> {
    return id
  }
}

export default ApiService
