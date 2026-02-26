import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersApi } from '../api/endpoints'
import type { DashboardResponse } from '../types'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    usersApi.getDashboard()
      .then((r) => setData(r as DashboardResponse))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container">Загрузка...</div>
  if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>
  if (!data) return null

  const { user, stats, recentActivity } = data
   const PRODUCT_TYPE_RU: Record<string, string> = {
        AUTO: 'Автострахование',
        HOME: 'Страхование жилья',
        LIFE: 'Страхование жизни',
        HEALTH: 'Медицинское страхование',
        TRAVEL: 'Страхование путешествий',
    }

    const STATUS_RU: Record<string, string> = {
        NEW: 'Новая',
        UNDER_REVIEW: 'На рассмотрении',
        APPROVED: 'Одобрена',
        REJECTED: 'Отклонена',
    }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.5rem' }}>Добро пожаловать, {user.fullName}!</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Дашборд</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Активные полисы</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>{stats.activePolicies-1}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Сумма покрытия</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>
            {stats.totalCoverage.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Заявки на рассмотрении</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>{stats.pendingApplications}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/products" className="btn btn-primary">Оформить страховку</Link>
        <Link to="/policies" className="btn btn-outline">Мои полисы</Link>
      </div>
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Последняя активность</h2>
        {recentActivity.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Нет активности</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentActivity.slice(0, 5).map((a) => (
                <Link
                    key={a.id}
                    to={`/applications/${a.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
              <div key={a.id} className="card" style={{ padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {a.type === 'application' ? 'Заявка' : 'Полис'} #{a.id} —{' '}
                    {PRODUCT_TYPE_RU[a.productType] ?? a.productType}{' '}
                    ({STATUS_RU[a.status] ?? a.status})
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {new Date(a.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
                    </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
