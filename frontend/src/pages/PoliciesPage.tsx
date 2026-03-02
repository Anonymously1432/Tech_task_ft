import { useEffect, useState } from 'react';
import { policiesApi } from '../api/endpoints';
import type { Policy } from '../types';

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Ожидает оплаты',
    ACTIVE: 'Действующий',
    EXPIRED: 'Истёк',
    CANCELLED: 'Отменён',
};

// Цвета для статусов (как на skinive.com)
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    PENDING: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    ACTIVE: { bg: '#E6F7E6', text: '#166534', dot: '#10B981' },
    EXPIRED: { bg: '#F1F5F9', text: '#475569', dot: '#64748b' },
    CANCELLED: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

const PRODUCT_TYPE_RU: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
};

// Иконки для типов продуктов
const PRODUCT_ICONS: Record<string, string> = {
    AUTO: '🚗',
    HOME: '🏠',
    LIFE: '❤️',
    HEALTH: '🏥',
    TRAVEL: '✈️',
};

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = (page = 1) => {
        setLoading(true);
        policiesApi.get({ status: statusFilter || undefined, page, limit: 10 })
            .then((res) => {
                setPolicies(res.policies as Policy[]);
                setPagination(res.pagination);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load(1);
    }, [statusFilter]);

    if (loading && policies.length === 0) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка полисов...
        </div>
    );

    if (error) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
        }}>
            {error}
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '3rem',
            paddingBottom: '4rem',
        }}>
            <div className="container">
                {/* Заголовок страницы */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: '#1e293b',
                    }}>
                        Мои полисы
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Управляйте своими страховыми полисами
                    </p>
                </div>

                {/* Фильтр по статусу */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                    }}>
            <span style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#475569',
            }}>
              Фильтр по статусу:
            </span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '0.75rem 2rem 0.75rem 1rem',
                                fontSize: '0.95rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '40px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                outline: 'none',
                                minWidth: '200px',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '16px',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#667eea';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <option value="">Все статусы</option>
                            <option value="ACTIVE">Активные</option>
                            <option value="PENDING">Ожидают</option>
                            <option value="EXPIRED">Истёкшие</option>
                            <option value="CANCELLED">Отменённые</option>
                        </select>
                    </div>
                </div>

                {/* Список полисов */}
                {policies.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        borderRadius: '32px',
                        border: '1px solid #e9eef2',
                    }}>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
                            У вас пока нет полисов
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {policies.map((policy) => {
                            const statusColors = STATUS_COLORS[policy.status] || { bg: '#F1F5F9', text: '#475569', dot: '#64748b' };
                            const icon = PRODUCT_ICONS[policy.productType] || '📄';

                            return (
                                <div
                                    key={policy.id}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        border: '1px solid #e9eef2',
                                        borderRadius: '28px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                                    }}
                                >
                                    {/* Верхняя часть карточки - номер и статус */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1.25rem',
                                        flexWrap: 'wrap',
                                        gap: '0.75rem',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: '#1e293b',
                      }}>
                        Полис #{policy.policyNumber}
                      </span>
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
                                            {STATUS_LABELS[policy.status] || policy.status}
                    </span>
                                    </div>

                                    {/* Основная информация в сетке */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1.25rem',
                                    }}>
                                        {/* Тип страхования с иконкой */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                          fontSize: '1.5rem',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                      }}>
                        {icon}
                      </span>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Тип</div>
                                                <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                                    {PRODUCT_TYPE_RU[policy.productType] || policy.productType}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Период действия */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Период действия</div>
                                            <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                                {new Date(policy.startDate).toLocaleDateString('ru-RU')} — {new Date(policy.endDate).toLocaleDateString('ru-RU')}
                                            </div>
                                        </div>

                                        {/* Сумма покрытия */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Сумма покрытия</div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                {policy.coverageAmount.toLocaleString('ru-RU')} ₽
                                            </div>
                                        </div>

                                        {/* Премия */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Премия</div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                {policy.premium.toLocaleString('ru-RU')} ₽
                                            </div>
                                        </div>
                                    </div>

                                    {/* Дополнительная информация при необходимости */}
                                    <div style={{
                                        fontSize: '0.9rem',
                                        color: '#94a3b8',
                                        borderTop: '1px solid #e9eef2',
                                        paddingTop: '1rem',
                                        marginTop: '0.5rem',
                                    }}>
                                        <span>ID: {policy.id}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Пагинация */}
                {pagination.total > pagination.limit && (
                    <div style={{
                        marginTop: '2.5rem',
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        alignItems: 'center',
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
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.color = '#667eea';
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
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.color = '#667eea';
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
            </div>
        </div>
    );
}