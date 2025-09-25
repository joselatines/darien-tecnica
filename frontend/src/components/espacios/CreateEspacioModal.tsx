import { useState } from 'react'
import type { CreateEspacioDto } from '../../types/espacios.interface'

interface CreateEspacioModalProps {
  isOpen: boolean
  onClose: () => void
  submit: (data: CreateEspacioDto) => void
  isSubmitting?: boolean
}

export default function CreateEspacioModal({
  isOpen,
  onClose,
  submit,
  isSubmitting = false
}: CreateEspacioModalProps) {
  const [formData, setFormData] = useState<CreateEspacioDto>({
    name: '',
    location: '',
    capacity: 1,
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || 1 : value
    }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es requerido'
    }

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Nombre debe tener al menos 3 caracteres'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Ubicación es requerida'
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacidad debe ser al menos 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    submit(formData)
    // Reset form
    setFormData({
      name: '',
      location: '',
      capacity: 1,
      description: ''
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
            <h5 className="modal-title">Crear Espacio</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                {errors.location && <div className="text-danger">{errors.location}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="capacity" className="form-label">
                  Capacidad
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
                {errors.capacity && <div className="text-danger">{errors.capacity}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción (opcional)
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'disabled' : ''}`}
                disabled={isSubmitting}
              >
                Crear Espacio
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
