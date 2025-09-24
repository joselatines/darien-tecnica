import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const exists = email === 'test@example.com'; // static check
    if (exists) {
      navigate('/dashboard/reservas');
    } else {
      const create = window.confirm('¿Crear usuario?');
      if (create) {
        alert('Usuario creado'); // static create
        navigate('/dashboard/reservas');
      }
    }
  };

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
        <button className="btn btn-primary" onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  )
}
