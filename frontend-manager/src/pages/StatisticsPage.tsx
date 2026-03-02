import { useEffect, useState } from 'react';
import { managerApi } from '../api/endpoints';

interface Stats {
    period: string;
    byType: Record<string, number>;
    byStatus?: Record<string, number>;
    conversion: { total: number; approved: number; rejected: number; rate?: number };
}

export default function StatisticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const PRODUCT_TYPE_RU: Record<string, string> = {
        AUTO: 'Автострахование',
        HOME: 'Страхование жилья',
        LIFE: 'Страхование жизни',
        HEALTH: 'Медицинское страхование',
        TRAVEL: 'Страхование путешествий',
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

    const PRODUCT_COLORS: Record<string, string> = {
        AUTO: '#3B82F6',
        HOME: '#10B981',
        LIFE: '#EF4444',
        HEALTH: '#8B5CF6',
        TRAVEL: '#F59E0B',
    };

    useEffect(() => {
        managerApi.getStatistics(period)
            .then(setStats)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [period]);

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
            Загрузка статистики...
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

    if (!stats) return null;

    const typeEntries = Object.entries(stats.byType || {}).sort((a, b) => b[1] - a[1]);
    const total = stats.conversion?.total || 0;
    const approved = stats.conversion?.approved || 0;
    const rejected = stats.conversion?.rejected || 0;
    const rate = stats.conversion?.rate ?? (total ? approved / total : 0);

    // Находим максимальное значение для пропорций
    const maxTypeValue = Math.max(...typeEntries.map(([_, v]) => v), 1);
    const maxStatusValue = stats.byStatus ? Math.max(...Object.values(stats.byStatus), 1) : 1;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '2rem',
            paddingBottom: '4rem',
        }}>
            <div className="container">
                {/* Заголовок и селектор периода */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 700,
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                        }}>
                            Статистика
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                            Аналитика по заявкам и конверсии
                        </p>
                    </div>

                    {/* Стилизованный селектор периода */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            style={{
                                padding: '0.75rem 2.5rem 0.75rem 1.5rem',
                                fontSize: '1rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '40px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '180px',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '16px',
                                fontWeight: 500,
                                color: '#1e293b',
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
                            <option value="week">Последняя неделя</option>
                            <option value="month">Последний месяц</option>
                            <option value="quarter">Последний квартал</option>
                            <option value="year">Последний год</option>
                        </select>
                    </div>
                </div>

                {/* Карточки статистики */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                }}>
                    {/* Карточка конверсии */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        border: '1px solid #e9eef2',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e9eef2',
                            background: '#f8fafc',
                        }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                margin: 0,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ fontSize: '1.3rem' }}>📊</span> Конверсия заявок
                            </h2>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                        Конверсия
                                    </div>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 700,
                                        color: '#4f5bd5',
                                    }}>
                                        {(rate * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    background: `conic-gradient(#10B981 0deg ${approved * 3.6}deg, #EF4444 ${approved * 3.6}deg 360deg)`,
                                    border: '4px solid #f1f5f9',
                                }} />
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                        Одобрено
                                    </div>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#10B981',
                                    }}>
                                        {approved}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                        Отклонено
                                    </div>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#EF4444',
                                    }}>
                                        {rejected}
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '16px',
                                textAlign: 'center',
                            }}>
                                <span style={{ color: '#475569' }}>Всего заявок: </span>
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Карточка по типам страховок */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        border: '1px solid #e9eef2',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e9eef2',
                            background: '#f8fafc',
                        }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                margin: 0,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ fontSize: '1.3rem' }}>📋</span> По типам страховок
                            </h2>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {typeEntries.length === 0 ? (
                                <p style={{ color: '#94a3b8', textAlign: 'center', margin: 0 }}>Нет данных</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {typeEntries.map(([type, count]) => {
                                        const percentage = (count / maxTypeValue) * 100;
                                        const color = PRODUCT_COLORS[type] || '#64748b';

                                        return (
                                            <div key={type}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.5rem',
                                                }}>
                          <span style={{ fontWeight: 500, color: '#1e293b' }}>
                            {PRODUCT_TYPE_RU[type] || type}
                          </span>
                                                    <span style={{
                                                        fontWeight: 600,
                                                        color: color,
                                                    }}>
                            {count}
                          </span>
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    backgroundColor: '#e2e8f0',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${percentage}%`,
                                                        height: '100%',
                                                        background: color,
                                                        borderRadius: '4px',
                                                        transition: 'width 0.3s',
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Карточка по статусам (если есть данные) */}
                    {stats.byStatus && Object.keys(stats.byStatus).length > 0 && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            border: '1px solid #e9eef2',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                borderBottom: '1px solid #e9eef2',
                                background: '#f8fafc',
                            }}>
                                <h2 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    margin: 0,
                                    color: '#1e293b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    <span style={{ fontSize: '1.3rem' }}>🔄</span> По статусам
                                </h2>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Object.entries(stats.byStatus).map(([status, count]) => {
                                        const percentage = (count / maxStatusValue) * 100;
                                        const color = STATUS_COLORS[status] || '#64748b';

                                        return (
                                            <div key={status}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.5rem',
                                                }}>
                          <span style={{ fontWeight: 500, color: '#1e293b' }}>
                            {STATUS_RU[status] || status}
                          </span>
                                                    <span style={{
                                                        fontWeight: 600,
                                                        color: color,
                                                    }}>
                            {count}
                          </span>
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    backgroundColor: '#e2e8f0',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${percentage}%`,
                                                        height: '100%',
                                                        background: color,
                                                        borderRadius: '4px',
                                                        transition: 'width 0.3s',
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}