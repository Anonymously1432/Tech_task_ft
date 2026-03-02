import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { managerApi } from '../api/endpoints';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    NEW: { bg: '#EBF5FF', text: '#1E4A6B', dot: '#3B82F6' },
    UNDER_REVIEW: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    APPROVED: { bg: '#E6F7E6', text: '#166534', dot: '#10B981' },
    REJECTED: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

const STATUS_LABELS: Record<string, string> = {
    NEW: 'Новая',
    UNDER_REVIEW: 'На рассмотрении',
    APPROVED: 'Одобрена',
    REJECTED: 'Отклонена',
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

interface ManagerApp {
    id: number;
    client: { fullName: string; email: string };
    productType: string;
    status: string;
    calculatedPrice: number;
    createdAt: string;
}

export default function ApplicationsPage() {
    const [apps, setApps] = useState<ManagerApp[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = (page = 1) => {
        setLoading(true);
        managerApi.getApplications({
            status: statusFilter || undefined,
            productType: productFilter || undefined,
            search: search || undefined,
            page,
            limit: 20
        })
            .then((res) => {
                setApps(res.applications as ManagerApp[]);
                setPagination(res.pagination);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(1);
    }, [statusFilter, productFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        load(1);
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setProductFilter('');
        setSearch('');
        load(1);
    };

    if (loading && apps.length === 0) return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка заявок...
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
            padding: '2rem',
            textAlign: 'center',
        }}>
            {error}
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '2rem',
            paddingBottom: '4rem',
        }}>
            <div className="container">
                {/* Заголовок */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: '#1e293b',
                    }}>
                        Управление заявками
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Всего заявок: <strong>{pagination.total}</strong>
                    </p>
                </div>

                {/* Фильтры и поиск */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                }}>
                    <form onSubmit={handleSearch}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}>
                            {/* Поиск */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Поиск по ID, имени или email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem 0.9rem 3rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: 'white',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#4f5bd5';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 91, 213, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8',
                                    fontSize: '1.2rem',
                                }}>
                  🔍
                </span>
                            </div>

                            {/* Фильтр по статусу */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 2.5rem 0.9rem 1.2rem',
                                    fontSize: '1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '20px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '16px',
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#4f5bd5';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 91, 213, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Все статусы</option>
                                <option value="NEW">🆕 Новые</option>
                                <option value="UNDER_REVIEW">⏳ На рассмотрении</option>
                                <option value="APPROVED">✅ Одобрены</option>
                                <option value="REJECTED">❌ Отклонены</option>
                            </select>

                            {/* Фильтр по типу продукта */}
                            <select
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 2.5rem 0.9rem 1.2rem',
                                    fontSize: '1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '20px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '16px',
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#4f5bd5';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 91, 213, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Все типы</option>
                                <option value="AUTO">🚗 Автострахование</option>
                                <option value="HOME">🏠 Страхование жилья</option>
                                <option value="LIFE">❤️ Страхование жизни</option>
                                <option value="HEALTH">🏥 Медицинское страхование</option>
                                <option value="TRAVEL">✈️ Страхование путешествий</option>
                            </select>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end',
                        }}>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                style={{
                                    padding: '0.7rem 1.5rem',
                                    backgroundColor: 'white',
                                    color: '#475569',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '40px',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#94a3b8';
                                    e.currentTarget.style.color = '#1e293b';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.color = '#475569';
                                }}
                            >
                                Сбросить фильтры
                            </button>

                            <button
                                type="submit"
                                style={{
                                    padding: '0.7rem 2rem',
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
                                Применить
                            </button>
                        </div>
                    </form>
                </div>

                {/* Список заявок */}
                {apps.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        border: '1px solid #e9eef2',
                    }}>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
                            Заявки не найдены
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {apps.map((app) => {
                                const statusColors = STATUS_COLORS[app.status] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };
                                const icon = PRODUCT_ICONS[app.productType] || '📄';

                                return (
                                    <Link
                                        key={app.id}
                                        to={`/applications/${app.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            className="card"
                                            style={{
                                                padding: '1.25rem',
                                                border: '1px solid #e9eef2',
                                                borderRadius: '28px',
                                                backgroundColor: 'white',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#4f5bd5';
                                                e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(79, 91, 213, 0.2)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#e9eef2';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                gap: '1rem',
                                                marginBottom: '1rem',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '18px',
                                                        background: 'linear-gradient(135deg, #4f5bd520 0%, #962fbf30 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                    }}>
                                                        {icon}
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '1.2rem',
                                                            fontWeight: 600,
                                                            color: '#1e293b',
                                                        }}>
                                                            Заявка #{app.id}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.9rem',
                                                            color: '#64748b',
                                                        }}>
                                                            {app.client?.fullName || 'Клиент'} • {app.client?.email || '-'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.4rem 1rem',
                                                    backgroundColor: statusColors.bg,
                                                    color: statusColors.text,
                                                    borderRadius: '30px',
                                                    fontSize: '0.9rem',
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

                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                                gap: '1rem',
                                                marginBottom: '1rem',
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Тип страхования
                                                    </div>
                                                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                                        {PRODUCT_TYPE_RU[app.productType] || app.productType}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Дата создания
                                                    </div>
                                                    <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                                        {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                                        Сумма
                                                    </div>
                                                    <div style={{
                                                        fontWeight: 600,
                                                        color: '#4f5bd5',
                                                    }}>
                                                        {app.calculatedPrice?.toLocaleString('ru-RU')} ₽
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                        <span style={{
                            color: '#4f5bd5',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                        }}>
                          Подробнее →
                        </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Пагинация */}
                        {pagination.total > pagination.limit && (
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '2rem',
                            }}>
                                <button
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: 'white',
                                        color: '#475569',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                                        opacity: pagination.page <= 1 ? 0.5 : 1,
                                        transition: 'border-color 0.2s, color 0.2s',
                                    }}
                                    disabled={pagination.page <= 1}
                                    onClick={() => load(pagination.page - 1)}
                                    onMouseOver={(e) => {
                                        if (pagination.page > 1) {
                                            e.currentTarget.style.borderColor = '#4f5bd5';
                                            e.currentTarget.style.color = '#4f5bd5';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.color = '#475569';
                                    }}
                                >
                                    ← Назад
                                </button>

                                <span style={{
                                    padding: '0.5rem 1.5rem',
                                    color: '#1e293b',
                                    fontWeight: 500,
                                }}>
                  Стр. {pagination.page} из {Math.ceil(pagination.total / pagination.limit)}
                </span>

                                <button
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: 'white',
                                        color: '#475569',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'not-allowed' : 'pointer',
                                        opacity: pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 0.5 : 1,
                                        transition: 'border-color 0.2s, color 0.2s',
                                    }}
                                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                    onClick={() => load(pagination.page + 1)}
                                    onMouseOver={(e) => {
                                        if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
                                            e.currentTarget.style.borderColor = '#4f5bd5';
                                            e.currentTarget.style.color = '#4f5bd5';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.color = '#475569';
                                    }}
                                >
                                    Вперёд →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}