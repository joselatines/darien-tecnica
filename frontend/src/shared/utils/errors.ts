import type { AxiosError } from 'axios'

// Map HTTP status codes to user-friendly messages
const statusMessages: Record<number, string> = {
  400: 'Solicitud incorrecta. Verifica los datos.',
  401: 'No autorizado. Inicia sesión nuevamente.',
  403: 'Sin permisos para esta acción.',
  404: 'Recurso no encontrado.',
  409: 'Conflicto en la solicitud.',
  422: 'Datos inválidos.',
  429: 'Demasiadas solicitudes. Intenta de nuevo.',
  500: 'Error del servidor. Contacta al soporte.',
  502: 'Error de conexión. Intenta de nuevo.',
  503: 'Servicio no disponible. Intenta más tarde.',
  504: 'Tiempo de espera agotado.'
}

const getKnownErrors = (message: string): string | null => {
  if (message.includes('User has reached the maximum')) {
    return 'Haz superado el límite de reservaciones por semana.'
  }
  return null
}

/**
 * Handles API errors and returns a user-friendly message.
 * @param error - The Axios error.
 * @param context - The operation context (optional).
 * @returns A user-friendly error message in Spanish.
 */
export const handleApiError = (error: AxiosError, context: string = 'operación'): string => {
  const status = error.response?.status || 500
  const message =
    (error.response?.data as { message?: string })?.message || error.message || 'Error inesperado'

  // Check for known error
  const knownError = getKnownErrors(message)
  if (knownError) {
    console.error(`Error [${status}]: ${context}`, { message, url: error.config?.url })
    return knownError
  }

  // Get status-based message or fallback
  const userMessage = statusMessages[status] || `Error ${status}: ${message}`
  console.error(`Error [${status}]: ${context}`, { message, url: error.config?.url })

  return userMessage
}
