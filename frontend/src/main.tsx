import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import EspaciosPage from './pages/espacios/EspaciosPage.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import LoginPage from './pages/LoginPage.tsx'
import ReservacionesPage from './pages/reservas/ReservacionesPage.tsx'
import Providers from './Providers.tsx'
import SingleEspacio from './pages/espacios/SingleEspacio.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="dashboard" element={<MainLayout />}>
            <Route path="espacios">
              <Route index element={<EspaciosPage />} />
              <Route path=":id" element={<SingleEspacio />} />
            </Route>
            <Route path="reservas" element={<ReservacionesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
)
