export interface Espacio {
  id: string
  name: string
  location: string
  capacity: number
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateEspacioDto {
  name: string
  location: string
  capacity: number
  description?: string
}
