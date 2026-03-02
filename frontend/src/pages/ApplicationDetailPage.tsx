import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsApi } from '../api/endpoints';

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
}

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

const STATUS_RU: Record<string, string> = {
    NEW: 'Новая',
    UNDER_REVIEW: 'На рассмотрении',
    APPROVED: 'Одобрена',
    REJECTED: 'Отклонена',
};

const STATUS_COLORS: Record<string, string> = {
    NEW: '#3B82F6',
    UNDER_REVIEW: '#F59E0B',
    APPROVED: '#10B981',
    REJECTED: '#EF4444',
};

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
};

const PRODUCT_ICONS: Record<string, string> = {
    AUTO: '🚗',
    HOME: '🏠',
    LIFE: '❤️',
    HEALTH: '🏥',
    TRAVEL: '✈️',
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    return String(value);
}

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

export default function ClientApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [app, setApp] = useState<AppDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        applicationsApi
            .getById(Number(id))
            .then((r) => setApp(r as AppDetail))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
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
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                padding: '2rem',
                textAlign: 'center',
            }}>
                {error}
            </div>
        );
    }

    if (!app) return null;

    const icon = PRODUCT_ICONS[app.productType] || '📄';

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
                    fontSize: '0.95rem',
                }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            padding: 0,
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                        Дашборд
                    </button>
                    <span style={{ color: '#cbd5e0' }}>→</span>
                    <span style={{ color: '#1e293b', fontWeight: 500 }}>Заявка #{app.id}</span>
                </div>

                {/* Заголовок и статус */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba240 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                        }}>
                            {icon}
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                            fontWeight: 700,
                            margin: 0,
                            color: '#1e293b',
                        }}>
                            Заявка #{app.id}
                        </h1>
                    </div>

                    <span style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '40px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        backgroundColor: `${STATUS_COLORS[app.status]}15`,
                        color: STATUS_COLORS[app.status],
                        border: `1px solid ${STATUS_COLORS[app.status]}30`,
                    }}>
                        {STATUS_RU[app.status] || app.status}
                    </span>
                </div>

                {/* Карточка с данными заявки */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem',
                    padding: '2rem',
                }}>
                    <h2 style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: '#1e293b',
                    }}>
                        Данные заявки
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '120px 1fr',
                            alignItems: 'baseline',
                            gap: '0.5rem 1rem',
                        }}>
                            <span style={{ color: '#64748b' }}>Тип страхования:</span>
                            <span style={{ fontWeight: 500, color: '#1e293b' }}>
                                {PRODUCT_TYPE_RU[app.productType] || app.productType}
                            </span>

                            <span style={{ color: '#64748b' }}>Предварительная стоимость:</span>
                            <span style={{
                                fontWeight: 600,
                                color: '#667eea',
                                fontSize: '1.1rem',
                            }}>
                                {app.calculatedPrice?.toLocaleString('ru-RU')} ₽
                            </span>

                            <span style={{ color: '#64748b' }}>Дата создания:</span>
                            <span style={{ fontWeight: 500, color: '#1e293b' }}>
                                {new Date(app.createdAt).toLocaleString('ru-RU')}
                            </span>
                        </div>

                        {app.data && Object.keys(app.data).length > 0 && (
                            <ApplicationDetails data={app.data} />
                        )}
                    </div>
                </div>

                {/* История статусов */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                    marginBottom: '2rem',
                    padding: '2rem',
                }}>
                    <h2 style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: '#1e293b',
                    }}>
                        История статусов
                    </h2>

                    {app.statusHistory.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                            Нет истории изменений
                        </p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {app.statusHistory.map((h, i) => (
                                <li
                                    key={i}
                                    style={{
                                        padding: '1rem 0',
                                        borderBottom: i < app.statusHistory.length - 1 ? '1px solid #e9eef2' : 'none',
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        flexWrap: 'wrap',
                                        marginBottom: h.comment ? '0.5rem' : 0,
                                    }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            padding: '0.3rem 1rem',
                                            backgroundColor: h.oldStatus ? `${STATUS_COLORS[h.oldStatus]}15` : '#f1f5f9',
                                            color: h.oldStatus ? STATUS_COLORS[h.oldStatus] : '#64748b',
                                            borderRadius: '30px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }}>
                                            {h.oldStatus ? STATUS_RU[h.oldStatus] || h.oldStatus : '—'}
                                        </span>

                                        <span style={{ color: '#94a3b8' }}>→</span>

                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            padding: '0.3rem 1rem',
                                            backgroundColor: `${STATUS_COLORS[h.newStatus]}15`,
                                            color: STATUS_COLORS[h.newStatus],
                                            borderRadius: '30px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }}>
                                            {STATUS_RU[h.newStatus] || h.newStatus}
                                        </span>

                                        <span style={{
                                            fontSize: '0.85rem',
                                            color: '#94a3b8',
                                            marginLeft: 'auto',
                                        }}>
                                            {new Date(h.createdAt).toLocaleString('ru-RU')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Кнопка возврата */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'white',
                            color: '#475569',
                            padding: '1rem 2.5rem',
                            borderRadius: '40px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            border: '2px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, color 0.2s',
                            minWidth: '250px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.color = '#667eea';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#475569';
                        }}
                    >
                        ← Вернуться к списку заявок
                    </button>
                </div>
            </div>
        </div>
    );
}