import { useState } from 'react'
import ReservacionCard from '../../components/reservaciones/ReservacionCard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import ErrorHandler from '../../components/shared/ErrorHandler'
import Loader from '../../components/shared/Loader'
import Pagination from '../../components/shared/Pagination'
import CreateReservaModal from '../../components/reservaciones/CreateReservaModal'
import type { CreateReservaDto } from '../../types/reservaciones.interface'
import { CACHE_KEYS } from '../../lib/constants'

export default function ReservacionesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const {
    data: apiRes,
    isLoading,
    error
  } = useQuery({
    queryKey: [CACHE_KEYS.RESERVATIONS, currentPage, itemsPerPage],
    queryFn: () => api.reservaciones.getAll(currentPage, itemsPerPage)
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateReservaDto) => api.reservaciones.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.RESERVATIONS] }) // Invalidate cache after successful creation
    }
  })

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  if (isLoading) return <Loader />
  if (error) return <ErrorHandler errMsg={error.message} />

  const data = apiRes?.data || []
  const meta = apiRes?.meta || {
    total: 0,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prev: null,
    next: null
  }

  return (
    <section className="container">
      <div className="my-4 d-flex justify-content-between">
        <h2>Reservas</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Crear reserva
        </button>
      </div>
      <section className="d-flex flex-wrap gap-3">
        {data.length === 0 && <p>No hay reservaciones</p>}
        {data.map((reservacion) => (
          <ReservacionCard key={reservacion.id} data={reservacion} />
        ))}
      </section>
      <Pagination
        currentPage={meta.currentPage}
        totalPages={meta.lastPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <CreateReservaModal
        isOpen={isModalOpen}
        submit={createMutation.mutateAsync}
        onClose={() => setIsModalOpen(false)}
        isSubmitting={createMutation.isPending}
      />
    </section>
  )
}
