import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api'
import ErrorHandler from '../../components/shared/ErrorHandler'
import Loader from '../../components/shared/Loader'
import type { Espacio } from '../../types/espacios.interface'

export default function SingleEspacio() {
  const { id } = useParams<{ id: string }>()

  const {
    data: espacio,
    isLoading,
    error
  } = useQuery<Espacio>({
    queryKey: ['espacios', id],
    queryFn: () => api.espacios.getById(id!),
    enabled: !!id
  })

  if (isLoading) return <Loader />
  if (error) return <ErrorHandler errMsg={error.message} />
  if (!espacio) return <div>Espacio no encontrado</div>

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            {/* IMAGE */}
            <img
              src={espacio.imgUrl}
              className="card-img-top"
              style={{ objectFit: 'cover' }}
              height={500}
              alt={espacio.name}
              loading='lazy'
            />
            <div className="card-body">
              <h1 className="card-title">{espacio.name}</h1>
              <p className="card-text">
                <i className="fas fa-map-marker-alt me-1"></i>
                <strong>Ubicación:</strong> {espacio.location}
              </p>
              <p className="card-text">
                <i className="fas fa-users me-1"></i>
                <strong>Capacidad:</strong> {espacio.capacity} personas
              </p>
              {espacio.description && (
                <p className="card-text">
                  <i className="fas fa-info me-1"></i>
                  <strong>Descripción:</strong> {espacio.description}
                </p>
              )}
              <div className="row">
                <div className="col-sm-6">
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Creado:</strong> {new Date(espacio.createdAt).toLocaleString()}
                    </small>
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Actualizado:</strong> {new Date(espacio.updatedAt).toLocaleString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
