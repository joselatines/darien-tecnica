import { Outlet, NavLink, useNavigate } from 'react-router'
import { api } from '../services/api'
import { useRole } from '../hooks/useRole'

export default function MainLayout() {
  const navigate = useNavigate()
  const { isAdmin } = useRole()

  const handleLogout = async () => {
    await api.auth.logout()
    navigate('/')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav
        className={`navbar navbar-expand-lg sticky-top ${
          isAdmin ? 'navbar-dark bg-dark' : 'navbar-light'
        }`}
      >
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
      <main className="flex-grow-1 container-fluid py-5" style={{ backgroundColor: '#dee2e6' }}>
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3">
        Prueba técnica 24/09/2025 Darien para el role de React Node Developer
      </footer>
    </div>
  )
}
