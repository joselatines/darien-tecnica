import { Outlet, NavLink, useNavigate } from 'react-router'

export default function MainLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">Dashboard</span>
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/dashboard/reservas">
              Reservas
            </NavLink>
            <NavLink className="nav-link" to="/dashboard/espacios">
              Espacios
            </NavLink>
          </div>
          <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-light text-center py-3">
        Prueba tecnica 24/09/2025 Dorian para el role de React Node Developer
      </footer>
    </div>
  )
}
