import { useEffect, useState } from 'react'
import { usersApi } from '../api/endpoints'

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: number; email: string; fullName: string; phone?: string; birthDate: string; address?: string } | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    usersApi.getMe()
      .then((res) => {
        setUser(res)
        setForm({ fullName: res.fullName, email: res.email, address: res.address || '' })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await usersApi.updateMe(form)
      setSuccess('Изменения сохранены')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleDeleteProfile = () => {
    alert('Функция удаления профиля не реализована. Это намеренный баг для тестирования DevTools Elements.')
  }

  if (loading) return <div className="container">Загрузка...</div>
  if (!user) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h1 style={{ marginBottom: '1rem' }}>Профиль</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Email (только чтение)</label>
            <input
              value={form.email}
              readOnly
              style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input value={user.phone || ''} readOnly style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </div>
          <div className="form-group">
            <label>Дата рождения</label>
            <input
              value={user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : ''}
              readOnly
              style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label>Адрес</label>
            <input
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          {success && <p style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>{success}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
            Сохранить изменения
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDeleteProfile}
            style={{ opacity: 0, pointerEvents: 'auto' }}
          >
            Удалить профиль
          </button>
        </form>
      </div>
    </div>
  )
}
