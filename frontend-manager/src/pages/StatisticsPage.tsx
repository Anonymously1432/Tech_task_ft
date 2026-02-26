import { useEffect, useState } from 'react'
import { managerApi } from '../api/endpoints'

interface Stats {
  period: string
  byType: Record<string, number>
  byStatus?: Record<string, number>
  conversion: { total: number; approved: number; rejected: number; rate?: number }
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  useEffect(() => {
    managerApi.getStatistics(period)
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [period])

  if (loading) return <div className="container">Загрузка...</div>
  if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>
  if (!stats) return null

    const typeEntries = Object.entries(stats.byType || {}).sort((a, b) => b[1] - a[1])
    const total = stats.conversion?.total || 0
    const approved = stats.conversion?.approved || 0
    const rejected = stats.conversion?.rejected || 0
    const rate = stats.conversion?.rate ?? (total ? approved / total : 0)

    return (
        <div className="container">
            <h1 style={{ marginBottom: '1rem' }}>Статистика</h1>
            <div style={{ marginBottom: '1rem' }}>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }}
                >
                    <option value="week">Неделя</option>
                    <option value="month">Месяц</option>
                    <option value="quarter">Квартал</option>
                    <option value="year">Год</option>
                </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Конверсия</h2>
                    <p>Одобрено: <strong>{approved}</strong></p>
                    <p>Отклонено: <strong>{rejected}</strong></p>
                    <p>Всего: <strong>{total}</strong></p>
                    <p>Конверсия: <strong>{(rate * 100).toFixed(1)}%</strong></p>
                </div>
                <div className="card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>По типам страховок</h2>
                    {typeEntries.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>Нет данных</p>
                    ) : (
                        <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                            {typeEntries.map(([type, count]) => (
                                <li key={type}>
                                    {PRODUCT_TYPE_RU[type] || type}: <strong>{count}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {stats.byStatus && Object.keys(stats.byStatus).length > 0 && (
                    <div className="card">
                        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>По статусам</h2>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                            {Object.entries(stats.byStatus).map(([status, count]) => (
                                <li key={status}>
                                    {STATUS_RU[status] || status}: <strong>{count}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
