import { useParams } from 'react-router'

export default function SingleEspacio() {
  const { id } = useParams()
  return <div>SingleEspacio id: {id}</div>
}
