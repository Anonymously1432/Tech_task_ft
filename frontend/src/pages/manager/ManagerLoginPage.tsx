import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ApiError } from '../../api/client'

export default function ManagerLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login(email, password)
      if (res.user.role === 'manager') {
        navigate('/manager/dashboard')
      } else {
        setError('Доступ только для менеджеров')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.body?.error || err.message)
      } else {
        setError('Ошибка входа')
      }
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem' }}>Вход для менеджера</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Войти
          </button>
        </form>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <Link to="/login">Клиентский вход</Link>
        </p>
      </div>
    </div>
  )
}
