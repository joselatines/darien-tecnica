import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('jose@example.com')
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (email: string) => api.auth.login(email),
    onSuccess: () => {
      toast.success('Inicio de sesión exitoso')
      navigate('/dashboard/reservas')
    },
    onError: (error) => {
      // If login fails, offer to register
      const register = window.confirm(`${error.message}. ¿Deseas registrarte?`)
      if (register) {
        registerMutation.mutate(email)
      }
    }
  })

  const registerMutation = useMutation({
    mutationFn: (email: string) => api.auth.register(email),
    onSuccess: () => {
      toast.success('Usuario registrado exitosamente')
      navigate('/dashboard/reservas')
    },
    onError: (error) => {
      toast.error(`Error al registrar: ${error.message}`)
    }
  })

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error('Por favor ingresa un correo electrónico')
      return
    }
    loginMutation.mutate(email)
  }

  const handleLoginAsAdmin = async () => {
    await toast.promise(api.auth.loginAsAdmin(), {
      loading: 'Iniciando sesión como administrador...',
      success: 'Sesión de administrador iniciada',
      error: (err) => `Error: ${err.message}`
    })
    navigate('/dashboard/reservas')
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50">
        <input
          type="email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
        />
        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          {loginMutation.isPending || registerMutation.isPending ? 'Cargando...' : 'Entrar'}
        </button>

        <button
          className="btn btn-primary ms-2"
          onClick={handleLoginAsAdmin}
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          Entrar como Administrador
        </button>
      </div>
    </div>
  )
}
