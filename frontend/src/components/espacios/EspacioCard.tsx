import { useNavigate } from 'react-router'
import type { Espacio } from '../../types/espacios.interface'

export default function EspacioCard({ data }: { data: Espacio }) {
  const navigate = useNavigate()

  return (
    <div className="card shadow-sm" style={{ width: '24rem' }}>
      <img
        src={data.imgUrl}
        className="card-img-top"
        alt={data.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title text-primary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`${data.id}`)}
        >
          {data.name}
        </h5>
        <p className="card-text text-muted mb-2">
          <i className="fas fa-map-marker-alt me-1"></i>
          {data.location}
        </p>
        <p className="card-text">
          <strong>Capacidad:</strong> {data.capacity} personas
        </p>
        {data.description && (
          <p className="card-text flex-grow-1">
            <strong>Descripción:</strong> {data.description}
          </p>
        )}
        <div className="mt-auto">
          <small className="text-muted">
            Creado: {new Date(data.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  )
}
