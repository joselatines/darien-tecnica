import { useState } from 'react'
import ReservacionCard from '../components/reservaciones/ReservacionCard'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import ErrorHandler from '../components/shared/ErrorHandler'
import Loader from '../components/shared/Loader'
import Pagination from '../components/shared/Pagination'

export default function ReservacionesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const {
    data: apiRes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['reservaciones', currentPage, itemsPerPage],
    queryFn: () => api.reservaciones.getAll(currentPage, itemsPerPage)
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
      <h2 className="my-4">Reservas</h2>
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
    </section>
  )
}
