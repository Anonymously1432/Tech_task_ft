import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { applicationsApi } from '../api/endpoints'

interface AppDetail {
    id: number
    client: { id: number; fullName: string; email: string; phone: string }
    productType: string
    status: string
    data: Record<string, unknown>
    calculatedPrice: number
    createdAt: string
    statusHistory: {
        oldStatus?: string
        newStatus: string
        comment?: string
        createdAt: string
    }[]
}

const DETAIL_LABELS: Record<string, string> = {
    area: 'Площадь, м²',
    floor: 'Этаж',
    address: 'Адрес',
    buildYear: 'Год постройки',
    propertyType: 'Тип недвижимости',
    coverageAmount: 'Сумма покрытия',
    age: "Возраст",
    gender: "Пол",
    smoking: "Курение",
    termYears: "Срок страхования",
    chronicDiseases: "Хронические заболевания",
    program: "Программа",
    dentistry: "Стоматология",
    hospitalization: "Госпитализация",
    vin: "ВИН",
    year: "Год выпуска",
    brand: "Марка автомобиля",
    model: "Модель",
    plateNumber: "Госномер",
    insuranceType: "Тип страховки",
    drivingExperience: "Водительский стаж",
    country: "Страна/регион",
    endDate: "Дата окончания",
    startDate: "Дата начала",
    travelers: "Количество человек",
    activeLeisure: "Активный отдых",
}

const STATUS_RU: Record<string, string> = {
    NEW: 'Новая',
    UNDER_REVIEW: 'На рассмотрении',
    APPROVED: 'Одобрена',
    REJECTED: 'Отклонена',
}

const STATUS_COLORS: Record<string, string> = {
    NEW: '#64748b',
    UNDER_REVIEW: '#f59e0b',
    APPROVED: '#10b981',
    REJECTED: '#ef4444',
}

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
}

function ApplicationDetails({ data }: { data: Record<string, unknown> }) {
    return (
        <div style={{ marginTop: '0.75rem' }}>
            <strong>Детали заявки:</strong>

            <div
                style={{
                    marginTop: '0.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '0.5rem 1rem',
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius)',
                }}
            >
                {Object.entries(data).map(([key, value]) => {
                    let displayValue: string
                    if (value === true) displayValue = 'Да'
                    else if (value === false) displayValue = 'Нет'
                    else displayValue = value === null || value === undefined ? '—' : String(value)

                    return (
                        <div key={key} style={{ display: 'contents' }}>
                            <div style={{ color: 'var(--color-text-muted)' }}>
                                {DETAIL_LABELS[key] ?? key}
                            </div>
                            <div style={{ wordBreak: 'break-word' }}>{displayValue}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function ClientApplicationDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [app, setApp] = useState<AppDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        setLoading(true)
        applicationsApi
            .getById(Number(id))
            .then((r) => setApp(r as AppDetail))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
                <div>Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--color-danger)' }}>{error}</div>
            </div>
        )
    }

    if (!app) return null

    return (
        <div className="container" style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                <a href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Дашборд
                </a>
                <span style={{ margin: '0 0.5rem' }}>→</span>
                <span>Заявка #{app.id}</span>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h1 style={{ margin: 0 }}>Заявка #{app.id}</h1>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    backgroundColor: `${STATUS_COLORS[app.status]}20`,
                    color: STATUS_COLORS[app.status],
                }}>
                    {STATUS_RU[app.status] || app.status}
                </span>
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Данные заявки</h2>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <p style={{ margin: 0 }}>
                        <strong>Тип страхования:</strong> {PRODUCT_TYPE_RU[app.productType] || app.productType}
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Предварительная стоимость:</strong>{' '}
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                            {app.calculatedPrice?.toLocaleString('ru-RU')} ₽
                        </span>
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Дата создания:</strong> {new Date(app.createdAt).toLocaleString('ru-RU')}
                    </p>
                </div>

                {app.data && Object.keys(app.data).length > 0 && (
                    <ApplicationDetails data={app.data} />
                )}
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>История статусов</h2>
                {app.statusHistory.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Нет истории</p>
                ) : (
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                        {app.statusHistory.map((h, i) => (
                            <li key={i}>
                                {h.oldStatus ? STATUS_RU[h.oldStatus] || h.oldStatus : '—'} → {STATUS_RU[h.newStatus] || h.newStatus}
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {new Date(h.createdAt).toLocaleString('ru-RU')}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => window.history.back()}
                    style={{ minWidth: 200 }}
                >
                    ← Вернуться к списку заявок
                </button>
            </div>
        </div>
    )
}