import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import EspaciosPage from './pages/EspaciosPage.tsx'
import MainLayout from './layouts/MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="dashboard" element={<MainLayout />}>
          <Route path="espacios" element={<EspaciosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
