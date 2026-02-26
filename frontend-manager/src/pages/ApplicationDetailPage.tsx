import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { managerApi } from '../api/endpoints'

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
    comments: { id: number; author: string; comment: string; createdAt: string }[]
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

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
    return String(value)
}

function ApplicationDetails({ data }: { data: Record<string, unknown> }) {
    return (
        <div style={{ marginTop: '0.75rem' }}>
            <strong>Детали:</strong>

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
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ display: 'contents' }}>
                        <div style={{ color: 'var(--color-text-muted)' }}>
                            {DETAIL_LABELS[key] ?? key}
                        </div>
                        <div style={{ wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: formatValue(value) }}>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [app, setApp] = useState<AppDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [newComment, setNewComment] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const load = () => {
        if (!id) return
        setLoading(true)
        managerApi
            .getApplicationById(Number(id))
            .then((r) => setApp(r as AppDetail))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [id])

    const handleStatusChange = async (status: string, comment?: string) => {
        if (!id) return
        if (status === 'REJECTED' && !rejectionReason.trim()) return

        setSubmitting(true)
        try {
            await managerApi.updateStatus(
                Number(id),
                status,
                comment,
                status === 'REJECTED' ? rejectionReason : undefined
            )
            setRejectionReason('')
            load()
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleAddComment = async () => {
        if (!id || !newComment.trim()) return

        setSubmitting(true)
        try {
            await managerApi.addComment(Number(id), newComment.trim())
            setNewComment('')
            load()
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="container">Загрузка...</div>
    if (error) return <div className="container" style={{ color: 'var(--color-danger)' }}>{error}</div>
    if (!app) return null

    const canTake = app.status === 'NEW'
    const canApprove = app.status === 'UNDER_REVIEW'
    const canReject = app.status === 'UNDER_REVIEW'

    return (
        <div className="container" style={{ maxWidth: 800 }}>
            <h1 style={{ marginBottom: '1rem' }}>Заявка #{app.id}</h1>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Клиент</h2>
                <p><strong>ФИО:</strong> {app.client?.fullName}</p>
                <p><strong>Email:</strong> {app.client?.email}</p>
                <p><strong>Телефон:</strong> {app.client?.phone || '—'}</p>
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Данные заявки</h2>
                <p><strong>Тип:</strong> {PRODUCT_TYPE_RU[app.productType] || app.productType}</p>
                <p><strong>Статус:</strong> {STATUS_LABELS[app.status] || app.status}</p>
                <p><strong>Стоимость:</strong> {app.calculatedPrice?.toLocaleString('ru-RU')} ₽</p>
                <p><strong>Дата:</strong> {new Date(app.createdAt).toLocaleString('ru-RU')}</p>

                {app.data && Object.keys(app.data).length > 0 && (
                    <ApplicationDetails data={app.data} />
                )}
            </div>

            {!['APPROVED', 'REJECTED'].includes(app.status) && <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Действия</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {canTake && (
                        <button
                            className="btn btn-primary"
                            onClick={() => handleStatusChange('UNDER_REVIEW', 'Взято на рассмотрение')}
                            disabled={submitting}
                        >
                            Взять на рассмотрение
                        </button>
                    )}

                    {canApprove && (
                        <button
                            className="btn btn-primary"
                            style={{ background: 'var(--color-success)' }}
                            onClick={() => handleStatusChange('APPROVED', 'Одобрено')}
                            disabled={submitting}
                        >
                            Одобрить
                        </button>
                    )}

                    {canReject && (
                        <>
                            <input
                                type="text"
                                placeholder="Причина отклонения"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid #cbd5e1',
                                    minWidth: 200,
                                }}
                            />
                            <button
                                className="btn btn-secondary"
                                style={{ background: 'var(--color-danger)' }}
                                onClick={() => handleStatusChange('REJECTED')}
                                disabled={submitting || !rejectionReason.trim()}
                            >
                                Отклонить
                            </button>
                        </>
                    )}
                </div>
            </div>}

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>История статусов</h2>
                {app.statusHistory.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Нет истории</p>
                ) : (
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                        {app.statusHistory.map((h, i) => (
                            <li key={i}>
                                {h.oldStatus ? STATUS_LABELS[h.oldStatus] || h.oldStatus : '—'} → {STATUS_LABELS[h.newStatus] || h.newStatus}
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {new Date(h.createdAt).toLocaleString('ru-RU')}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Комментарии</h2>

                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Новый комментарий"
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid #cbd5e1',
                        marginBottom: '0.5rem',
                    }}
                />

                <button
                    className="btn btn-primary"
                    onClick={handleAddComment}
                    disabled={submitting || !newComment.trim()}
                >
                    Добавить
                </button>

                {app.comments.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                        Нет комментариев
                    </p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }}>
                        {app.comments.map((c) => (
                            <li
                                key={c.id}
                                style={{
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: 'var(--radius)',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <strong>{c.author}</strong>
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {new Date(c.createdAt).toLocaleString('ru-RU')}
                </span>
                                <p style={{ marginTop: '0.25rem' }}>{c.comment}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}