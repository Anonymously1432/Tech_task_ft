import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/endpoints';
import type { Product } from '../types';

// Расширим ICON_BY_TYPE, добавив цвета для фона
const ICON_BY_TYPE: Record<string, { icon: string; color: string }> = {
    AUTO: { icon: '🚗', color: '#3b82f6' },
    HOME: { icon: '🏠', color: '#10b981' },
    LIFE: { icon: '❤️', color: '#ef4444' },
    HEALTH: { icon: '🏥', color: '#8b5cf6' },
    // Намеренно НЕТ TRAVEL, чтобы getIcon вызывал ошибку для TRAVEL
    // Это создаст ошибку в консоли, но иконка не отобразится
};

const PRODUCT_TITLE_BY_TYPE: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        productsApi.getAll()
            .then((res) => setProducts(res.products))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Сохраняем оригинальную логику с try-catch и выводом в консоль
    const getIcon = useCallback((productType: string) => {
        try {
            return ICON_BY_TYPE[productType].icon;
        } catch (e) {
            console.error('Ошибка в getIcon для типа:', productType, e);
            // Возвращаем запасную иконку, чтобы интерфейс не ломался
            return '📦';
        }
    }, []);

    // Добавляем функцию для получения цвета иконки
    const getIconColor = useCallback((productType: string) => {
        try {
            return ICON_BY_TYPE[productType]?.color || '#64748b';
        } catch {
            return '#64748b';
        }
    }, []);

    if (loading) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка продуктов...
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
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 6vw, 3rem)',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #1e2b3a 0%, #2d3e5a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Наши страховые продукты
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#64748b',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}>
                        Выберите подходящую страховку для себя и своих близких
                    </p>
                </div>

                {/* Сетка продуктов - используем auto-fit для адаптивности вместо фиксированных 5 колонок */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {products.map((product) => {
                        const icon = getIcon(product.type);
                        const iconColor = getIconColor(product.type);

                        return (
                            <div
                                key={product.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '1.75rem',
                                    border: '1px solid #e9eef2',
                                    borderRadius: '32px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 25px 35px -8px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                {/* Иконка на градиентном фоне */}
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '24px',
                                    background: `linear-gradient(135deg, ${iconColor}20 0%, ${iconColor}40 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.2rem',
                                    marginBottom: '1.5rem',
                                    color: iconColor,
                                }}>
                                    {icon}
                                </div>

                                {/* Название продукта */}
                                <h3 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                }}>
                                    {PRODUCT_TITLE_BY_TYPE[product.type] ?? product.name}
                                </h3>

                                {/* Описание */}
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#64748b',
                                    marginBottom: '1.25rem',
                                    lineHeight: 1.5,
                                    flex: 1,
                                }}>
                                    {product.description}
                                </p>

                                {/* Цена */}
                                <div style={{
                                    marginBottom: '1.25rem',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                }}>
                  <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#1e293b',
                  }}>
                    {Number(product.basePrice).toLocaleString('ru-RU')} ₽
                  </span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                        marginLeft: '0.25rem',
                                    }}>
                    /мес
                  </span>
                                </div>

                                {/* Кнопка "Подробнее" */}
                                <Link
                                    to={`/products/${product.type}`}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        padding: '0.9rem 1.5rem',
                                        borderRadius: '40px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        boxShadow: '0 10px 20px -8px rgba(102, 126, 234, 0.5)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        border: 'none',
                                        cursor: 'pointer',
                                        marginTop: 'auto',
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
                                    Подробнее
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}