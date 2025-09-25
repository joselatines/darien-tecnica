import { useState } from 'react'
import type { CreateReservaDto } from '../../types/reservaciones.interface'
import toast from 'react-hot-toast'
import SelectEspacio from '../espacios/SelectEspacio'

interface CreateReservaModalProps {
  isOpen: boolean
  onClose: () => void
  submit: (data: CreateReservaDto) => Promise<any>
  isSubmitting?: boolean
}

export default function CreateReservaModal({
  isOpen,
  onClose,
  submit,
  isSubmitting = false
}: CreateReservaModalProps) {
  const [formData, setFormData] = useState<CreateReservaDto>({
    espacioId: '',
    clientId: '',
    reservationDate: new Date(),
    startTime: '',
    endTime: '',
    status: 'pending'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'reservationDate' ? new Date(value) : value
    }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.espacioId.trim()) {
      newErrors.espacioId = 'ID del espacio es requerido'
    }

    if (!formData.clientId.trim()) {
      newErrors.clientId = 'ID del cliente es requerido'
    }

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const resDateStr = formData.reservationDate.toISOString().split('T')[0]
    if (resDateStr < todayStr) {
      newErrors.reservationDate = 'La fecha de reserva no puede ser en el pasado'
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Hora de inicio es requerida'
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Hora de fin es requerida'
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser después de la hora de inicio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await toast.promise(submit(formData), {
      loading: 'Creando reserva...',
      success: () => {
        // Reset form
        setFormData({
          espacioId: '',
          clientId: '',
          reservationDate: new Date(),
          startTime: '',
          endTime: '',
          status: 'pending'
        })
        return `Reserva creada`
      },
      error: (res) => `${res.message}`
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="modal show d-block"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Reserva</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="espacioId" className="form-label">
                  Espacio
                </label>
                <SelectEspacio
                  value={formData.espacioId}
                  onChange={handleChange}
                  name="espacioId"
                  required
                />
                {errors.espacioId && <div className="text-danger">{errors.espacioId}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="clientId" className="form-label">
                  ID del Cliente
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                />
                {errors.clientId && <div className="text-danger">{errors.clientId}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="reservationDate" className="form-label">
                  Fecha de Reserva
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="reservationDate"
                  name="reservationDate"
                  value={formData.reservationDate.toISOString().split('T')[0]}
                  onChange={handleChange}
                  required
                />
                {errors.reservationDate && <div className="text-danger">{errors.reservationDate}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="startTime" className="form-label">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
                {errors.startTime && <div className="text-danger">{errors.startTime}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="endTime" className="form-label">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
                {errors.endTime && <div className="text-danger">{errors.endTime}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Estado
                </label>
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'disabled' : ''}`}
                disabled={isSubmitting}
              >
                Crear Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
