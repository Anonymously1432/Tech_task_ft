import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { managerApi } from '../api/endpoints'

const STATUS_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  UNDER_REVIEW: '#eab308',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  UNDER_REVIEW: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
}

interface ManagerApp {
  id: number
  client: { fullName: string; email: string }
  productType: string
  status: string
  calculatedPrice: number
  createdAt: string
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ManagerApp[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [statusFilter, setStatusFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (page = 1) => {
    setLoading(true)
    managerApi.getApplications({ status: statusFilter || undefined, productType: productFilter || undefined, search: search || undefined, page, limit: 20 })
      .then((res) => {
        setApps(res.applications as ManagerApp[])
        setPagination(res.pagination)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(1)
  }, [statusFilter, productFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    load(1)
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem' }}>Список заявок</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 200 }}>
          <input
            type="text"
            placeholder="Поиск по ID клиента"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid #cbd5e1' }}
          />
          <button type="submit" className="btn btn-primary">Поиск</button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }}
        >
          <option value="">Все статусы</option>
          <option value="NEW">Новые</option>
          <option value="UNDER_REVIEW">На рассмотрении</option>
          <option value="APPROVED">Одобрены</option>
          <option value="REJECTED">Отклонены</option>
        </select>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }}
        >
          <option value="">Все типы</option>
          <option value="AUTO">AUTO</option>
          <option value="HOME">HOME</option>
          <option value="LIFE">LIFE</option>
          <option value="HEALTH">HEALTH</option>
          <option value="TRAVEL">TRAVEL</option>
        </select>
      </div>
      {loading && apps.length === 0 ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div style={{ color: 'var(--color-danger)' }}>{error}</div>
      ) : apps.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Нет заявок</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Клиент</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Тип</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Дата</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Статус</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Сумма</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>{a.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div>{a.client?.fullName || '-'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{a.client?.email || '-'}</div>
                    </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                          {PRODUCT_TYPE_RU[a.productType] || a.productType}
                      </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{new Date(a.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          background: STATUS_COLORS[a.status] || '#94a3b8',
                          color: 'white',
                          fontSize: '0.85rem',
                        }}
                      >
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{a.calculatedPrice?.toLocaleString('ru-RU')} ₽</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link to={`/applications/${a.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.total > pagination.limit && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                disabled={pagination.page <= 1}
                onClick={() => load(pagination.page - 1)}
              >
                Назад
              </button>
              <span style={{ padding: '0.5rem 1rem' }}>Стр. {pagination.page} из {Math.ceil(pagination.total / pagination.limit)}</span>
              <button
                className="btn btn-outline"
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => load(pagination.page + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
