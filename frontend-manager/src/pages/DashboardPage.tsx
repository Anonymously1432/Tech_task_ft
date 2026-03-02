import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { managerApi } from '../api/endpoints';

interface ManagerDashboard {
    stats: { newToday: number; underReview: number; approvedThisMonth: number; rejectedThisMonth: number };
    chartData: { date: string; new?: number }[];
    recentApplications: { id: number; clientFullName: string; productType: string; status: string; createdAt: string }[];
}

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

// Цвета для статусов
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    NEW: { bg: '#EBF5FF', text: '#1E4A6B', dot: '#3B82F6' },
    UNDER_REVIEW: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    APPROVED: { bg: '#E6F7E6', text: '#166534', dot: '#10B981' },
    REJECTED: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

// Иконки для статистики
const STAT_ICONS = {
    newToday: '📋',
    underReview: '⏳',
    approvedThisMonth: '✅',
    rejectedThisMonth: '❌',
};

export default function DashboardPage() {
    const [data, setData] = useState<ManagerDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        managerApi.getDashboard()
            .then((r) => setData(r as ManagerDashboard))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

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
            Загрузка дашборда менеджера...
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

    if (!data) return null;

    const { stats, chartData, recentApplications } = data;

    // Максимальное значение для графика
    const maxChartValue = Math.max(...chartData.map(d => d.new || 0), 5);

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
                        Дашборд менеджера
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Управляйте заявками и отслеживайте статистику
                    </p>
                </div>

                {/* Статистика */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem',
                }}>
                    <StatCard
                        label="Новых сегодня"
                        value={stats.newToday}
                        icon={STAT_ICONS.newToday}
                        color="#3b82f6"
                    />
                    <StatCard
                        label="На рассмотрении"
                        value={stats.underReview}
                        icon={STAT_ICONS.underReview}
                        color="#f59e0b"
                    />
                    <StatCard
                        label="Одобрено за месяц"
                        value={stats.approvedThisMonth}
                        icon={STAT_ICONS.approvedThisMonth}
                        color="#10b981"
                    />
                    <StatCard
                        label="Отклонено за месяц"
                        value={stats.rejectedThisMonth}
                        icon={STAT_ICONS.rejectedThisMonth}
                        color="#ef4444"
                    />
                </div>

                {/* График */}
                {chartData && chartData.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        border: '1px solid #e9eef2',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        marginBottom: '2.5rem',
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
                                Заявки по дням (последние 7 дней)
                            </h2>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                alignItems: 'flex-end',
                                minHeight: '180px',
                            }}>
                                {chartData.slice(-7).map((d, i) => {
                                    const value = d.new || 0;
                                    const height = Math.max(20, (value / maxChartValue) * 120);

                                    return (
                                        <div key={i} style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                color: '#1e293b',
                                            }}>
                                                {value}
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: `${height}px`,
                                                background: 'linear-gradient(180deg, #667eea 0%, #4f5bd5 100%)',
                                                borderRadius: '12px 12px 6px 6px',
                                                transition: 'height 0.3s',
                                                boxShadow: '0 4px 8px rgba(79, 91, 213, 0.3)',
                                            }} />
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: '#64748b',
                                                fontWeight: 500,
                                            }}>
                        {new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                      </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Последние заявки */}
                <section>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}>
                        <h2 style={{
                            fontSize: '1.3rem',
                            fontWeight: 600,
                            margin: 0,
                            color: '#1e293b',
                        }}>
                            Последние заявки
                        </h2>

                        <Link
                            to="/applications"
                            style={{
                                background: 'linear-gradient(135deg, #4f5bd5 0%, #962fbf 100%)',
                                color: 'white',
                                padding: '0.7rem 1.5rem',
                                borderRadius: '40px',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                textDecoration: 'none',
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
                            Все заявки →
                        </Link>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            border: '1px solid #e9eef2',
                        }}>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
                                Нет заявок
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentApplications.slice(0, 5).map((a) => {
                                const statusColors = STATUS_COLORS[a.status] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };

                                return (
                                    <Link
                                        key={a.id}
                                        to={`/applications/${a.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            className="card"
                                            style={{
                                                padding: '1rem 1.25rem',
                                                border: '1px solid #e9eef2',
                                                borderRadius: '24px',
                                                backgroundColor: 'white',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#4f5bd5';
                                                e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(79, 91, 213, 0.2)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#e9eef2';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '0.75rem',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#1e293b',
                          }}>
                            #{a.id}
                          </span>
                                                    <span style={{ color: '#94a3b8' }}>•</span>
                                                    <span style={{
                                                        fontSize: '0.95rem',
                                                        color: '#475569',
                                                    }}>
                            {a.clientFullName || 'Клиент'}
                          </span>
                                                    <span style={{ color: '#94a3b8' }}>•</span>
                                                    <span style={{
                                                        fontSize: '0.9rem',
                                                        color: '#64748b',
                                                    }}>
                            {PRODUCT_TYPE_RU[a.productType] ?? a.productType}
                          </span>

                                                    {/* Бейдж статуса */}
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        padding: '0.25rem 1rem',
                                                        backgroundColor: statusColors.bg,
                                                        color: statusColors.text,
                                                        borderRadius: '30px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                    }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: statusColors.dot,
                            }} />
                                                        {STATUS_RU[a.status] ?? a.status}
                          </span>
                                                </div>

                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    color: '#94a3b8',
                                                    whiteSpace: 'nowrap',
                                                }}>
                          {new Date(a.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// Компонент карточки статистики
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
    return (
        <div
            className="card"
            style={{
                padding: '1.5rem 1.5rem',
                border: '1px solid #e9eef2',
                borderRadius: '28px',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 30px -8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    background: color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: color,
                }}>
                    {icon}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                    {label}
                </p>
            </div>
            <p style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                fontWeight: 700,
                margin: 0,
                color: '#1e293b',
            }}>
                {value}
            </p>
        </div>
    );
}