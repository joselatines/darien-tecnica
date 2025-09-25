import { useQuery } from '@tanstack/react-query'
import { CACHE_KEYS } from '../../lib/constants'
import { api } from '../../services/api'
import type { Espacio } from '../../types/espacios.interface'

interface SelectEspacioProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  name?: string
  required?: boolean
}

export default function SelectEspacio({
  value,
  onChange,
  name = 'espacioId',
  required = false
}: SelectEspacioProps) {
  const { data, isLoading, error } = useQuery<Espacio[]>({
    queryKey: [CACHE_KEYS.ESPACIOS],
    queryFn: () => api.espacios.getAll()
  })

  if (error) {
    return <div className="text-danger">Error al cargar espacios: {error.message}</div>
  }

  return (
    <select
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={isLoading}
    >
      <option value="">{isLoading ? 'Cargando espacios...' : 'Selecciona un espacio'}</option>
      {data?.map((espacio) => (
        <option key={espacio.id} value={espacio.id}>
          {espacio.name} - {espacio.location} (Capacidad: {espacio.capacity})
        </option>
      ))}
    </select>
  )
}
