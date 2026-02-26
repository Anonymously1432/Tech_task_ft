import { useEffect, useState } from 'react'
import { policiesApi } from '../api/endpoints'
import type { Policy } from '../types'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает оплаты',
  ACTIVE: 'Действующий',
  EXPIRED: 'Истёк',
  CANCELLED: 'Отменён',
}

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (page = 1) => {
    setLoading(true)
    policiesApi.get({ status: statusFilter || undefined, page, limit: 10 })
      .then((res) => {
        setPolicies(res.policies as Policy[])
        setPagination(res.pagination)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(1)
  }, [statusFilter])

  if (loading && policies.length === 0) return <div className="container">Загрузка...</div>
  if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem' }}>Мои полисы</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }}
        >
          <option value="">Все статусы</option>
          <option value="ACTIVE">Активные</option>
          <option value="PENDING">Ожидают</option>
          <option value="EXPIRED">Истёкшие</option>
          <option value="CANCELLED">Отменённые</option>
        </select>
      </div>
      {policies.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Нет полисов</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Номер</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Тип</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Статус</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Период</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Сумма покрытия</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Премия</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.policyNumber}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{PRODUCT_TYPE_RU[p.productType] || p.productType}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{STATUS_LABELS[p.status] || p.status}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {new Date(p.startDate).toLocaleDateString('ru-RU')} — {new Date(p.endDate).toLocaleDateString('ru-RU')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.coverageAmount.toLocaleString('ru-RU')} ₽</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{p.premium.toLocaleString('ru-RU')} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
    </div>
  )
}
