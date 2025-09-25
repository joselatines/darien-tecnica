import { getReservacionStatusColor } from '../../shared/helpers/colors'
import { formatDate, formatTime } from '../../shared/utils/dates'
import { capitalize } from '../../shared/utils/parsers'
import type { Reserva } from '../../types/reservaciones.interface'

export default function ReservacionCard({ data }: { data: Reserva }) {
  return (
    <div className="card shadow-sm border-0 mb-3">
      <div
        className="card-header bg-primary border-0 d-flex justify-content-between align-items-center"
      /*   style={{ backgroundColor: '#adb5bd' }} */
      >
        <h6 className="card-title mb-0 fw-bold text-white">Reservación #{data.id.slice(-6).toUpperCase()}</h6>
        <span className={`badge ${getReservacionStatusColor(data.status)} text-white`}>
          {capitalize(data.status)}
        </span>
      </div>

      <div className="card-body bg-gray">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <small className="text-muted">Fecha:</small>
              <p className="mb-0 fw-semibold">{formatDate(data.reservationDate)}</p>
            </div>

            <div className="mb-2">
              <small className="text-muted">Horario:</small>
              <p className="mb-0 fw-semibold">
                {formatTime(data.startTime)} - {formatTime(data.endTime)}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-2">
              <small className="text-muted">Espacio ID:</small>
              <p className="mb-0 text-truncate">{data.espacioId}</p>
            </div>

            <div className="mb-2">
              <small className="text-muted">Cliente ID:</small>
              <p className="mb-0 text-truncate">{data.clientId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Creado: {new Date(data.createdAt).toLocaleDateString()}
        </small>
        <small className="text-muted">
          Actualizado: {new Date(data.updatedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  )
}
