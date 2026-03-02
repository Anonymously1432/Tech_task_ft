import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { managerApi } from '../api/endpoints';

interface AppDetail {
    id: number;
    client: { id: number; fullName: string; email: string; phone: string };
    productType: string;
    status: string;
    data: Record<string, unknown> | string; // <-- теперь может быть и строкой
    calculatedPrice: number;
    createdAt: string;
    statusHistory: {
        oldStatus?: string;
        newStatus: string;
        comment?: string;
        createdAt: string;
    }[];
    comments: { id: number; author: string; comment: string; createdAt: string }[];
}

const STATUS_LABELS: Record<string, string> = {
    NEW: 'Новая',
    UNDER_REVIEW: 'На рассмотрении',
    APPROVED: 'Одобрена',
    REJECTED: 'Отклонена',
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    NEW: { bg: '#EBF5FF', text: '#1E4A6B', dot: '#3B82F6' },
    UNDER_REVIEW: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    APPROVED: { bg: '#E6F7E6', text: '#166534', dot: '#10B981' },
    REJECTED: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
};

const DETAIL_LABELS: Record<string, string> = {
    area: 'Площадь, м²',
    floor: 'Этаж',
    address: 'Адрес',
    buildYear: 'Год постройки',
    propertyType: 'Тип недвижимости',
    coverageAmount: 'Сумма покрытия',
    age: 'Возраст',
    gender: 'Пол',
    smoking: 'Курение',
    termYears: 'Срок страхования',
    chronicDiseases: 'Хронические заболевания',
    program: 'Программа',
    dentistry: 'Стоматология',
    hospitalization: 'Госпитализация',
    vin: 'VIN',
    year: 'Год выпуска',
    brand: 'Марка автомобиля',
    model: 'Модель',
    plateNumber: 'Госномер',
    insuranceType: 'Тип страховки',
    drivingExperience: 'Водительский стаж',
    country: 'Страна/регион',
    endDate: 'Дата окончания',
    startDate: 'Дата начала',
    travelers: 'Количество человек',
    activeLeisure: 'Активный отдых',
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    return String(value);
}

// ВОССТАНОВЛЕНО: исходная структура с display: contents
function ApplicationDetails({ data }: { data: Record<string, unknown> | string }) {
    // Парсим данные, если это строка
    let parsedData: Record<string, unknown> = {};

    if (typeof data === 'string') {
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            return <div style={{ color: '#ef4444' }}>Ошибка загрузки данных</div>;
        }
    } else {
        parsedData = data;
    }

    const entries = Object.entries(parsedData);

    if (entries.length === 0) return null;

    return (
        <div style={{ marginTop: '0.75rem' }}>
            <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Детали:</strong>

            <div
                style={{
                    marginTop: '0.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '0.5rem 1rem',
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '20px',
                    border: '1px solid #e9eef2',
                }}
            >
                {entries.map(([key, value]) => (
                    <div key={key} style={{ display: 'contents' }}>
                        <div style={{
                            color: '#64748b',
                            fontSize: '0.9rem',
                        }}>
                            {DETAIL_LABELS[key] ?? key}
                        </div>
                        <div style={{
                            wordBreak: 'break-word',
                            fontWeight: 500,
                            color: '#1e293b',
                        }}
                             dangerouslySetInnerHTML={{ __html: formatValue(value) }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [app, setApp] = useState<AppDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = () => {
        if (!id) return;
        setLoading(true);
        managerApi
            .getApplicationById(Number(id))
            .then((r) => setApp(r as AppDetail))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [id]);

    const handleStatusChange = async (status: string, comment?: string) => {
        if (!id) return;
        if (status === 'REJECTED' && !rejectionReason.trim()) return;

        setSubmitting(true);
        try {
            await managerApi.updateStatus(
                Number(id),
                status,
                comment,
                status === 'REJECTED' ? rejectionReason : undefined
            );
            setRejectionReason('');
            load();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddComment = async () => {
        if (!id || !newComment.trim()) return;

        setSubmitting(true);
        try {
            await managerApi.addComment(Number(id), newComment.trim());
            setNewComment('');
            load();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка...
        </div>
    );

    if (error) return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
        }}>
            {error}
        </div>
    );

    if (!app) return null;

    const canTake = app.status === 'NEW';
    const canApprove = app.status === 'UNDER_REVIEW';
    const canReject = app.status === 'UNDER_REVIEW';
    const statusColors = STATUS_COLORS[app.status] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '2rem',
            paddingBottom: '4rem',
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Навигация */}
                <div style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#64748b',
                }}>
                    <button
                        onClick={() => navigate('/applications')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            padding: 0,
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#4f5bd5'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                        Все заявки
                    </button>
                    <span>→</span>
                    <span style={{ color: '#1e293b', fontWeight: 500 }}>Заявка #{app.id}</span>
                </div>

                {/* Заголовок со статусом */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                        fontWeight: 700,
                        margin: 0,
                        color: '#1e293b',
                    }}>
                        Заявка #{app.id}
                    </h1>

                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        borderRadius: '40px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: statusColors.dot,
                        }} />
                        {STATUS_LABELS[app.status] || app.status}
                    </span>
                </div>

                {/* Карточка клиента */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '28px',
                    border: '1px solid #e9eef2',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        Клиент
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>ФИО:</strong> {app.client?.fullName}</p>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Email:</strong> {app.client?.email}</p>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Телефон:</strong> {app.client?.phone || '—'}</p>
                    </div>
                </div>

                {/* Карточка данных заявки */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '28px',
                    border: '1px solid #e9eef2',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        Данные заявки
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Тип:</strong> {PRODUCT_TYPE_RU[app.productType] || app.productType}</p>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Статус:</strong> {STATUS_LABELS[app.status] || app.status}</p>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Стоимость:</strong> <span style={{ fontWeight: 600, color: '#4f5bd5' }}>{app.calculatedPrice?.toLocaleString('ru-RU')} ₽</span></p>
                        <p style={{ margin: 0 }}><strong style={{ color: '#475569' }}>Дата:</strong> {new Date(app.createdAt).toLocaleString('ru-RU')}</p>
                    </div>

                    {app.data && Object.keys(app.data).length > 0 && (
                        <ApplicationDetails data={app.data} />
                    )}
                </div>

                {/* Действия (только для не финальных статусов) */}
                {!['APPROVED', 'REJECTED'].includes(app.status) && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '28px',
                        border: '1px solid #e9eef2',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                    }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                            Действия
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            {canTake && (
                                <button
                                    onClick={() => handleStatusChange('UNDER_REVIEW', 'Взято на рассмотрение')}
                                    disabled={submitting}
                                    style={{
                                        padding: '0.7rem 1.5rem',
                                        background: 'linear-gradient(135deg, #4f5bd5 0%, #962fbf 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 15px -6px rgba(79, 91, 213, 0.5)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(79, 91, 213, 0.6)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.boxShadow = '0 8px 15px -6px rgba(79, 91, 213, 0.5)';
                                    }}
                                >
                                    Взять на рассмотрение
                                </button>
                            )}

                            {canApprove && (
                                <button
                                    onClick={() => handleStatusChange('APPROVED', 'Одобрено')}
                                    disabled={submitting}
                                    style={{
                                        padding: '0.7rem 1.5rem',
                                        background: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 15px -6px rgba(16, 185, 129, 0.5)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(16, 185, 129, 0.6)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.boxShadow = '0 8px 15px -6px rgba(16, 185, 129, 0.5)';
                                    }}
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
                                            padding: '0.7rem 1rem',
                                            fontSize: '0.95rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '40px',
                                            minWidth: '200px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#4f5bd5'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                    />
                                    <button
                                        onClick={() => handleStatusChange('REJECTED')}
                                        disabled={submitting || !rejectionReason.trim()}
                                        style={{
                                            padding: '0.7rem 1.5rem',
                                            background: '#EF4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '40px',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                            cursor: submitting || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                                            opacity: submitting || !rejectionReason.trim() ? 0.6 : 1,
                                            boxShadow: '0 8px 15px -6px rgba(239, 68, 68, 0.5)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                        onMouseOver={(e) => {
                                            if (!submitting && rejectionReason.trim()) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(239, 68, 68, 0.6)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = '';
                                            e.currentTarget.style.boxShadow = '0 8px 15px -6px rgba(239, 68, 68, 0.5)';
                                        }}
                                    >
                                        Отклонить
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* История статусов */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '28px',
                    border: '1px solid #e9eef2',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        История статусов
                    </h2>
                    {app.statusHistory.length === 0 ? (
                        <p style={{ color: '#94a3b8', margin: 0 }}>Нет истории</p>
                    ) : (
                        <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                            {app.statusHistory.map((h, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem', color: '#475569' }}>
                                    {h.oldStatus ? STATUS_LABELS[h.oldStatus] || h.oldStatus : '—'} → {STATUS_LABELS[h.newStatus] || h.newStatus}
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                        {new Date(h.createdAt).toLocaleString('ru-RU')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Комментарии */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '28px',
                    border: '1px solid #e9eef2',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>
                        Комментарии
                    </h2>

                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Новый комментарий"
                        rows={2}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '20px',
                            marginBottom: '0.75rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4f5bd5'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />

                    <button
                        onClick={handleAddComment}
                        disabled={submitting || !newComment.trim()}
                        style={{
                            padding: '0.7rem 1.5rem',
                            background: 'linear-gradient(135deg, #4f5bd5 0%, #962fbf 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '40px',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                            opacity: submitting || !newComment.trim() ? 0.6 : 1,
                            boxShadow: '0 8px 15px -6px rgba(79, 91, 213, 0.5)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            marginBottom: '1.5rem',
                        }}
                        onMouseOver={(e) => {
                            if (!submitting && newComment.trim()) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(79, 91, 213, 0.6)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 8px 15px -6px rgba(79, 91, 213, 0.5)';
                        }}
                    >
                        Добавить
                    </button>

                    {app.comments.length === 0 ? (
                        <p style={{ color: '#94a3b8', margin: 0 }}>Нет комментариев</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {app.comments.map((c) => (
                                <li
                                    key={c.id}
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '20px',
                                        marginBottom: '0.75rem',
                                        border: '1px solid #e9eef2',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <strong style={{ color: '#1e293b' }}>{c.author}</strong>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            {new Date(c.createdAt).toLocaleString('ru-RU')}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: '#475569' }}>{c.comment}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}