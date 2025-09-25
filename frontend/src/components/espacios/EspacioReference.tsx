import React from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api'
import type { Espacio } from '../../types/espacios.interface'

export default function EspacioReference({ id }: { id: string }) {
  const navigate = useNavigate()

  const {
    data: espacio,
    isLoading,
    error
  } = useQuery<Espacio>({
    queryKey: ['espacios', id],
    queryFn: () => api.espacios.getById(id),
    enabled: !!id
  })

  const handleClick = () => {
    navigate(`/dashboard/espacios/${id}`)
  }

  if (isLoading) return <span className="text-muted">Cargando...</span>
  if (error) return <span className="text-danger">Error</span>
  if (!espacio) return <span className="text-muted">No encontrado</span>

  return (
    <span
      className="btn btn-link p-0 text-decoration-none"
      onClick={handleClick}
      title={`Ver detalles de ${espacio.name}`}
    >
      {espacio.name}
    </span>
  )
}
