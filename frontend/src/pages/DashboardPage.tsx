import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../api/endpoints';
import type { DashboardResponse } from '../types';

export default function DashboardPage() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        usersApi.getDashboard()
            .then((r) => setData(r as DashboardResponse))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Стиль для градиентного текста (как в Hero на главной)
    const gradientTextStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '3rem', textAlign: 'center', color: '#718096' }}>
            Загрузка...
        </div>
    );

    if (error) return (
        <div className="container" style={{ paddingTop: '3rem', textAlign: 'center', color: '#e53e3e' }}>
            {error}
        </div>
    );

    if (!data) return null;

    const { user, stats, recentActivity } = data;

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

    // Цвета для статусов (как индикаторы риска на skinive.com)
    const STATUS_COLORS: Record<string, { bg: string, text: string, dot: string }> = {
        NEW: { bg: '#EBF5FF', text: '#1E4A6B', dot: '#3B82F6' },
        UNDER_REVIEW: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
        APPROVED: { bg: '#E6F7E6', text: '#166534', dot: '#10B981' },
        REJECTED: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '2rem',
            paddingBottom: '3rem',
        }}>
            <div className="container">
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                        fontWeight: 700,
                        marginBottom: '0.25rem',
                    }}>
                        Добро пожаловать, <span style={gradientTextStyle}>{user.fullName}</span>
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '1.1rem',
                        margin: 0,
                    }}>
                        Ваша панель управления страховками
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem',
                }}>
                    {[
                        { label: 'Активные полисы', value: stats.activePolicies-1, icon: '📋', color: '#667eea' },
                        { label: 'Сумма покрытия', value: `${stats.totalCoverage.toLocaleString('ru-RU')} ₽`, icon: '💰', color: '#f59e0b' },
                        { label: 'Заявки на рассмотрении', value: stats.pendingApplications, icon: '⏳', color: '#ef4444' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                padding: '1.75rem 1.5rem',
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
                                    background: item.color + '15', // 15% прозрачности
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: item.color,
                                }}>
                                    {item.icon}
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                                    {item.label}
                                </p>
                            </div>
                            <p style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 700,
                                margin: 0,
                                color: '#1e293b',
                            }}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Кнопки действий - стилизованные как на главной */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '3rem',
                    flexWrap: 'wrap',
                }}>
                    <Link
                        to="/products"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '0.85rem 2rem',
                            borderRadius: '40px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 10px 20px -8px rgba(102, 126, 234, 0.5)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 25px -8px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(102, 126, 234, 0.5)';
                        }}
                    >
                        Оформить страховку
                    </Link>
                    <Link
                        to="/policies"
                        style={{
                            background: 'white',
                            color: '#2d3748',
                            padding: '0.85rem 2rem',
                            borderRadius: '40px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '2px solid #cbd5e0',
                            transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.color = '#667eea';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e0';
                            e.currentTarget.style.color = '#2d3748';
                        }}
                    >
                        Мои полисы
                    </Link>
                </div>

                {/* Последняя активность - стиль как на zachet.app */}
                <section>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        color: '#1e293b',
                    }}>
                        Последняя активность
                    </h2>
                    {recentActivity.length === 0 ? (
                        <div className="card" style={{
                            padding: '2rem',
                            textAlign: 'center',
                            borderRadius: '24px',
                            border: '1px solid #e9eef2',
                            backgroundColor: 'white',
                        }}>
                            <p style={{ color: '#94a3b8', margin: 0 }}>У вас пока нет активности</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentActivity.slice(0, 5).map((a) => {
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
                                                borderRadius: '20px',
                                                backgroundColor: 'white',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#cbd5e0';
                                                e.currentTarget.style.boxShadow = '0 8px 15px -6px rgba(0, 0, 0, 0.1)';
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
                                                gap: '0.5rem',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              color: '#1e293b',
                          }}>
                            {a.type === 'application' ? '📄 Заявка' : '📋 Полис'} #{a.id}
                          </span>
                                                    <span style={{ color: '#94a3b8' }}>•</span>
                                                    <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                            {PRODUCT_TYPE_RU[a.productType] ?? a.productType}
                          </span>
                                                    {/* Бейдж статуса как на skinive.com */}
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        padding: '0.25rem 0.75rem',
                                                        backgroundColor: statusColors.bg,
                                                        color: statusColors.text,
                                                        borderRadius: '30px',
                                                        fontSize: '0.8rem',
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