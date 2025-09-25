// Format date to be more readable
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time to 12-hour format if needed
export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  return hour >= 12 ? `${hour === 12 ? 12 : hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`
}
