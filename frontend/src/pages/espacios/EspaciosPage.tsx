import { useQuery } from '@tanstack/react-query'
import EspacioCard from '../../components/espacios/EspacioCard'
import { CACHE_KEYS } from '../../lib/constants'
import { api } from '../../services/api'

import Loader from '../../components/shared/Loader'
import ErrorHandler from '../../components/shared/ErrorHandler'

export default function EspaciosPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.ESPACIOS],
    queryFn: () => api.espacios.getAll()
  })

  if (isLoading) return <Loader />
  if (error) return <ErrorHandler errMsg={error.message} />
  if (!data) return <div>Espacio no encontrado</div>

  return (
    <div className="container">
      <div className="my-4 d-flex justify-content-between">
        <h2>Espacios</h2>
        <button className="btn btn-primary">Crear espacio</button>
      </div>
      <section className="d-flex flex-wrap gap-3">
        {data.map((espacio) => (
          <EspacioCard key={espacio.id} data={espacio} />
        ))}
      </section>
    </div>
  )
}
