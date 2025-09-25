import { useState } from 'react'
import ReservacionCard from '../components/reservaciones/ReservacionCard'
import type { Reserva } from '../types/reservaciones.interface'

export default function ReservacionesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Mock data with unique ids and varied dates
  const reservaciones: Reserva[] = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    espacioId: ((i % 3) + 1).toString(),
    clientId: ((i % 5) + 1).toString(),
    reservationDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    startTime: `${10 + (i % 3)}:00`,
    endTime: `${12 + (i % 3)}:00`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: i % 2 === 0 ? 'confirmed' : ('pending' as 'confirmed' | 'pending')
  }))

  const totalItems = reservaciones.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = reservaciones.slice(startIndex, startIndex + itemsPerPage)

  const apiRes = {
    data: paginatedData,
    meta: {
      total: totalItems,
      lastPage: totalPages,
      currentPage,
      perPage: itemsPerPage,
      prev: currentPage > 1 ? currentPage - 1 : null,
      next: currentPage < totalPages ? currentPage + 1 : null
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  return (
    <section className="container">
      <h2 className="my-4">Reservaciones</h2>
      <section className="d-flex flex-wrap gap-3">
        {apiRes.data.map((reservacion) => (
          <ReservacionCard key={reservacion.id} data={reservacion} />
        ))}
      </section>
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${apiRes.meta.prev === null ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previa
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${apiRes.meta.next === null ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </section>
  )
}
