import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { applicationsApi } from '../api/endpoints';

interface AppDetail {
    id: number;
    client: { id: number; fullName: string; email: string; phone: string };
    productType: string;
    status: string;
    data: Record<string, unknown>;
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

const PRODUCT_ICONS: Record<string, string> = {
    AUTO: '🚗',
    HOME: '🏠',
    LIFE: '❤️',
    HEALTH: '🏥',
    TRAVEL: '✈️',
};

function ApplicationDetails({ data }: { data: Record<string, unknown> }) {
    const entries = Object.entries(data).filter(([_, value]) =>
        value !== null && value !== undefined && value !== ''
    );

    if (entries.length === 0) return null;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '1rem',
            }}>
                Детали заявки
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem 1rem',
                background: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '24px',
                border: '1px solid #e9eef2',
            }}>
                {entries.map(([key, value], index) => {
                    let displayValue: string;
                    if (value === true) displayValue = 'Да';
                    else if (value === false) displayValue = 'Нет';
                    else if (value instanceof Date) displayValue = value.toLocaleDateString('ru-RU');
                    else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                        displayValue = new Date(value).toLocaleDateString('ru-RU');
                    } else displayValue = String(value);

                    return (
                        <div
                            key={key}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                padding: index % 2 === 0 ? '0' : '0', // Можно добавить чередование при необходимости
                            }}
                        >
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#64748b',
                            }}>
                                {DETAIL_LABELS[key] ?? key}
                            </span>
                            <span style={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#1e293b',
                                wordBreak: 'break-word',
                            }}>
                                {displayValue}
                            </span>
                        </div>
                    );
                })}
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
                Загрузка данных заявки...
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

    const statusColors = STATUS_COLORS[app.status] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };
    const icon = PRODUCT_ICONS[app.productType] || '📄';
    const productName = PRODUCT_TYPE_RU[app.productType] || app.productType;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '2rem',
            paddingBottom: '4rem',
        }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Навигация (хлебные крошки) */}
                <nav style={{
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    color: '#64748b',
                }}>
                    <Link
                        to="/dashboard"
                        style={{
                            color: '#64748b',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#667eea';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        Дашборд
                    </Link>
                    <span style={{ color: '#cbd5e0' }}>→</span>
                    <span style={{ color: '#1e293b', fontWeight: 500 }}>
                        Заявка #{app.id}
                    </span>
                </nav>

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
                        <div>
                            <h1 style={{
                                fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                                fontWeight: 700,
                                marginBottom: '0.25rem',
                                color: '#1e293b',
                            }}>
                                Заявка #{app.id}
                            </h1>
                            <p style={{ color: '#64748b', margin: 0 }}>
                                {productName}
                            </p>
                        </div>
                    </div>

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
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    }}>
                        <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: statusColors.dot,
                        }} />
                        {STATUS_RU[app.status] || app.status}
                    </span>
                </div>

                {/* Основная карточка с данными заявки */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.1)',
                    marginBottom: '1.5rem',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid #e9eef2',
                        background: '#f8fafc',
                    }}>
                        <h2 style={{
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            margin: 0,
                            color: '#1e293b',
                        }}>
                            Данные заявки
                        </h2>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: app.data && Object.keys(app.data).length > 0 ? '1rem' : 0,
                        }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                    Клиент
                                </div>
                                <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                    {app.client.fullName}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    {app.client.email} • {app.client.phone}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                    Предварительная стоимость
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                }}>
                                    {app.calculatedPrice?.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                    Дата создания
                                </div>
                                <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                    {new Date(app.createdAt).toLocaleDateString('ru-RU', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Детали заявки */}
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
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '1.25rem 2rem',
                        borderBottom: '1px solid #e9eef2',
                        background: '#f8fafc',
                    }}>
                        <h2 style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            margin: 0,
                            color: '#1e293b',
                        }}>
                            История статусов
                        </h2>
                    </div>

                    <div style={{ padding: '1.5rem 2rem' }}>
                        {app.statusHistory.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                                Нет истории изменений
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {app.statusHistory.map((h, i) => {
                                    const oldStatusColor = h.oldStatus ? STATUS_COLORS[h.oldStatus] : null;
                                    const newStatusColor = STATUS_COLORS[h.newStatus] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '1rem',
                                                padding: '0.75rem 0',
                                                borderBottom: i < app.statusHistory.length - 1 ? '1px dashed #e2e8f0' : 'none',
                                            }}
                                        >
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '12px',
                                                backgroundColor: '#f1f5f9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.1rem',
                                                color: '#64748b',
                                            }}>
                                                {i + 1}
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    flexWrap: 'wrap',
                                                    marginBottom: '0.25rem',
                                                }}>
                                                    {h.oldStatus ? (
                                                        <>
                                                            <span style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem',
                                                                padding: '0.2rem 0.75rem',
                                                                backgroundColor: oldStatusColor?.bg || '#f1f5f9',
                                                                color: oldStatusColor?.text || '#475569',
                                                                borderRadius: '30px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 500,
                                                            }}>
                                                                <span style={{
                                                                    width: '6px',
                                                                    height: '6px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: oldStatusColor?.dot || '#64748b',
                                                                }} />
                                                                {STATUS_RU[h.oldStatus] || h.oldStatus}
                                                            </span>
                                                            <span style={{ color: '#94a3b8' }}>→</span>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8' }}>— →</span>
                                                    )}

                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem',
                                                        padding: '0.2rem 0.75rem',
                                                        backgroundColor: newStatusColor.bg,
                                                        color: newStatusColor.text,
                                                        borderRadius: '30px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 500,
                                                    }}>
                                                        <span style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            backgroundColor: newStatusColor.dot,
                                                        }} />
                                                        {STATUS_RU[h.newStatus] || h.newStatus}
                                                    </span>

                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        color: '#94a3b8',
                                                        marginLeft: 'auto',
                                                    }}>
                                                        {new Date(h.createdAt).toLocaleString('ru-RU', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>

                                                {h.comment && (
                                                    <p style={{
                                                        margin: '0.5rem 0 0 0',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b',
                                                        paddingLeft: '0.5rem',
                                                        borderLeft: '3px solid #e2e8f0',
                                                    }}>
                                                        {h.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
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