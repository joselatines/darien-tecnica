import axios from 'axios'

// Configure Axios interceptors
axios.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY
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
  getAll() {}
}

export default ApiService
