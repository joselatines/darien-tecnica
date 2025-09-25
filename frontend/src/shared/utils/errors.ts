import type { AxiosError } from 'axios'

export const handleApiError = (error: AxiosError, context: string = 'la operación') => {
  // Extract status code from error response
  const statusCode = error.response?.status || 500
  const errorMessage = error.message || 'Algo inesperado ha ocurrido'

  // Default messages based on status codes
  const statusMessages: { [key: number]: string } = {
    400: `Solicitud incorrecta. Por favor, verifica los datos ingresados.`,
    401: `No autorizado. Por favor, inicia sesión nuevamente.`,
    403: `No tienes permisos para realizar esta acción.`,
    404: `Recurso no encontrado. La reservación solicitada no existe.`,
    409: `Conflicto: ${errorMessage.toLowerCase()}`,
    422: `Datos de entrada inválidos. ${errorMessage}`,
    429: `Demasiadas solicitudes. Por favor, intenta nuevamente en unos minutos.`,
    500: `Error interno del servidor. Por favor, contacta al soporte técnico.`,
    502: `Error de conexión con el servidor. Intenta nuevamente.`,
    503: `Servicio no disponible temporalmente. Por favor, intenta más tarde.`,
    504: `Tiempo de espera agotado. Verifica tu conexión a internet.`
  }

  // Get the specific message for the status code or use a generic one
  let userMessage = statusMessages[statusCode] || `Error ${statusCode}: ${errorMessage}`

  // Add context to the message
  if (!userMessage.includes(context)) {
    userMessage = `Error al ${context}. ${userMessage}`
  }

  // Log detailed error for debugging
  console.error(`API Error [${statusCode}]:`, {
    context,
    originalError: errorMessage,
    url: error.config?.url,
    method: error.config?.method
  })

  return userMessage
}
