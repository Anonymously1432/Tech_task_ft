import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ApiError } from '../api/client'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    birthDate: '',
    agree: false,
  })
  const [error, setError] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.password.length < 8) errs.password = 'Минимум 8 символов'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Пароли не совпадают'
    if (!/^\+7\d{10}$/.test(form.phone)) errs.phone = 'Формат: +7XXXXXXXXXX'
    const birth = new Date(form.birthDate)
    const age = (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    if (age < 18 || age > 100) errs.birthDate = 'Возраст 18–100 лет'
    if (!form.agree) errs.agree = 'Необходимо согласие'
    if (Object.keys(errs).length) {
      setError(errs)
      return
    }
    setError({})
    try {
      await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        birthDate: form.birthDate,
      })
      navigate('/login')
    } catch (err) {
      if (err instanceof ApiError && err.body?.details?.field) {
        setError(err.body.details.field as Record<string, string>)
      } else {
        setError({ email: (err as Error).message })
      }
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem' }}>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {error.email && <p className="form-error">{error.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            {error.password && <p className="form-error">{error.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтверждение пароля *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {error.confirmPassword && <p className="form-error">{error.confirmPassword}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="fullName">ФИО *</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+79001234567"
              value={form.phone}
              onChange={handleChange}
              required
            />
            {error.phone && <p className="form-error">{error.phone}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения *</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              required
            />
            {error.birthDate && <p className="form-error">{error.birthDate}</p>}
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
              style={{ width: 'auto', marginTop: '0.3rem' }}
            />
            <label htmlFor="agree" style={{ marginBottom: 0 }}>Согласен с условиями оферты *</label>
          </div>
          {error.agree && <p className="form-error">{error.agree}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Зарегистрироваться
          </button>
        </form>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}
