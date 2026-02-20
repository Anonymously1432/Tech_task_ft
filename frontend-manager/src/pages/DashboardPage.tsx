import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { managerApi } from '../api/endpoints'

interface ManagerDashboard {
  stats: { newToday: number; underReview: number; approvedThisMonth: number; rejectedThisMonth: number }
  chartData: { date: string; new?: number }[]
  recentApplications: { id: number; clientFullName: string; productType: string; status: string; createdAt: string }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<ManagerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    managerApi.getDashboard()
      .then((r) => setData(r as ManagerDashboard))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container">Загрузка...</div>
  if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>
  if (!data) return null

  const { stats, chartData, recentApplications } = data

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem' }}>Dashboard менеджера</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Новых сегодня</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>{stats.newToday}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>На рассмотрении</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0 0' }}>{stats.underReview}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Одобрено за месяц</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0 0', color: 'var(--color-success)' }}>{stats.approvedThisMonth}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Отклонено за месяц</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0 0', color: 'var(--color-danger)' }}>{stats.rejectedThisMonth}</p>
        </div>
      </div>
      {chartData && chartData.length > 0 && (
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Заявки по дням (7 дней)</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', minHeight: 120 }}>
            {chartData.slice(-7).map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: Math.max(20, (d.new || 0) * 5),
                    background: 'var(--color-primary)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.25rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Последние заявки</h2>
        <Link to="/applications" className="btn btn-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          Все заявки
        </Link>
        {recentApplications.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Нет заявок</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentApplications.slice(0, 5).map((a) => (
              <Link
                key={a.id}
                to={`/applications/${a.id}`}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit', padding: '0.75rem 1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>#{a.id} — {a.clientFullName || 'Клиент'} — {a.productType} ({a.status})</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {new Date(a.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
