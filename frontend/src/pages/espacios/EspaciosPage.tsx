import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import EspacioCard from '../../components/espacios/EspacioCard'
import { CACHE_KEYS } from '../../lib/constants'
import { api } from '../../services/api'
import CreateEspacioModal from '../../components/espacios/CreateEspacioModal'
import Loader from '../../components/shared/Loader'
import ErrorHandler from '../../components/shared/ErrorHandler'
import type { CreateEspacioDto } from '../../types/espacios.interface'
import { useRole } from '../../hooks/useRole'

export default function EspaciosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { isAdmin } = useRole()

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.ESPACIOS],
    queryFn: () => api.espacios.getAll()
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateEspacioDto) => api.espacios.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ESPACIOS] })
      toast.success('Espacio creado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al crear espacio: ${error.message}`)
    }
  })

  if (isLoading) return <Loader />
  if (error) return <ErrorHandler errMsg={error.message} />
  if (!data) return <div>Espacio no encontrado</div>

  return (
    <div className="container">
      <div className="my-4 d-flex justify-content-between">
        <h2>Espacios</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Crear espacio
          </button>
        )}
      </div>
      <section className="d-flex flex-wrap gap-3">
        {data.map((espacio) => (
          <EspacioCard key={espacio.id} data={espacio} />
        ))}
      </section>
      <CreateEspacioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submit={createMutation.mutate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}
