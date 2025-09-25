import EspacioCard from '../../components/espacios/EspacioCard'
import type { Espacio } from '../../types/espacios.interface'

const espacios: Espacio[] = [
  {
    id: '1',
    name: 'Coworking plaza 1',
    location: 'Caracas',
    capacity: 5,
    description: 'This coworking space is made for JS developers',
    createdAt: new Date(),
    updatedAt: new Date(),
    imgUrl: 'https://cataas.com/cat'
  },
  {
    id: '1',
    name: 'Coworking plaza 1',
    location: 'Caracas',
    capacity: 5,
    description: 'This coworking space is made for JS developers',
    createdAt: new Date(),
    updatedAt: new Date(),
    imgUrl: 'https://cataas.com/cat'
  },
  {
    id: '1',
    name: 'Coworking plaza 1',
    location: 'Caracas',
    capacity: 5,
    description: 'This coworking space is made for JS developers',
    createdAt: new Date(),
    updatedAt: new Date(),
    imgUrl: 'https://cataas.com/cat'
  },
  {
    id: '1',
    name: 'Coworking plaza 1',
    location: 'Caracas',
    capacity: 5,
    description: 'This coworking space is made for JS developers',
    createdAt: new Date(),
    updatedAt: new Date(),
    imgUrl: 'https://cataas.com/cat'
  }
]

export default function EspaciosPage() {
  return (
    <div className="container">
      <div className="my-4 d-flex justify-content-between">
        <h2>Espacios</h2>
        <button className="btn btn-primary">Crear espacio</button>
      </div>
      <section className="d-flex flex-wrap gap-3">
        {espacios.map((espacio) => (
          <EspacioCard key={espacio.id} data={espacio} />
        ))}
      </section>
    </div>
  )
}
