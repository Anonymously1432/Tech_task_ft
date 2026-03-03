import { useEffect, useState } from 'react';
import { usersApi } from '../api/endpoints';

export default function ProfilePage() {
    const [user, setUser] = useState<{ id: number; email: string; fullName: string; phone?: string; birthDate: string; address?: string } | null>(null);
    const [form, setForm] = useState({ fullName: '', email: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        usersApi.getMe()
            .then((res) => {
                setUser(res);
                setForm({ fullName: res.fullName, email: res.email, address: res.address || '' });
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await usersApi.updateMe(form);
            setSuccess('Изменения успешно сохранены');
            const updatedUser = await usersApi.getMe();
            setUser(updatedUser);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleDeleteProfile = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        alert('Функция удаления профиля не реализована');
        setShowDeleteConfirm(false);
    };

    if (loading) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка профиля...
        </div>
    );

    if (!user) return (
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

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '3rem',
            paddingBottom: '4rem',
        }}>
            <div className="container" style={{ maxWidth: '720px' }}>
                {/* Заголовок страницы */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: '#1e293b',
                    }}>
                        Личный кабинет
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        Управляйте своими данными
                    </p>
                </div>

                {/* Основная карточка профиля */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}>
                    {/* Шапка с аватаром */}
                    <div style={{
                        padding: '2rem 2rem 1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '30px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                border: '3px solid rgba(255, 255, 255, 0.3)',
                            }}>
                                👤
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    marginBottom: '0.25rem',
                                }}>
                                    {user.fullName}
                                </div>
                                <div style={{
                                    fontSize: '1rem',
                                    opacity: 0.9,
                                }}>
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Форма */}
                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                        {/* Секция: Основная информация */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                marginBottom: '1.5rem',
                                paddingBottom: '0.5rem',
                                borderBottom: '2px solid #e9eef2',
                            }}>
                                Основная информация
                            </h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: '#2d3e5a',
                                }}>
                                    ФИО
                                </label>
                                <input
                                    value={form.fullName}
                                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: 'white',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#667eea';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: '#2d3e5a',
                                }}>
                                    Email (не редактируется)
                                </label>
                                <input
                                    value={form.email}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: '#f8fafc',
                                        color: '#64748b',
                                        cursor: 'not-allowed',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: '#2d3e5a',
                                }}>
                                    Адрес
                                </label>
                                <input
                                    value={form.address}
                                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                    placeholder="Введите ваш адрес"
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.2rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: 'white',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#667eea';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Секция: Контактные данные */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                marginBottom: '1.5rem',
                                paddingBottom: '0.5rem',
                                borderBottom: '2px solid #e9eef2',
                            }}>
                                Контактные данные
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.5rem',
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        color: '#2d3e5a',
                                    }}>
                                        Телефон
                                    </label>
                                    <div style={{
                                        padding: '0.9rem 1.2rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: '#f8fafc',
                                        color: '#64748b',
                                    }}>
                                        {user.phone || 'Не указан'}
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        color: '#2d3e5a',
                                    }}>
                                        Дата рождения
                                    </label>
                                    <div style={{
                                        padding: '0.9rem 1.2rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '20px',
                                        backgroundColor: '#f8fafc',
                                        color: '#64748b',
                                    }}>
                                        {formatDate(user.birthDate) || 'Не указана'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Сообщения */}
                        {error && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem 1.25rem',
                                backgroundColor: '#FEE2E2',
                                border: '1px solid #FECACA',
                                borderRadius: '20px',
                                color: '#991B1B',
                                fontSize: '0.95rem',
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem 1.25rem',
                                backgroundColor: '#E6F7E6',
                                border: '1px solid #B8E0B8',
                                borderRadius: '20px',
                                color: '#166534',
                                fontSize: '0.95rem',
                            }}>
                                ✅ {success}
                            </div>
                        )}

                        {/* Кнопки действий */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}>
                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '1rem 2rem',
                                    borderRadius: '40px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px -8px rgba(102, 126, 234, 0.5)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    width: '100%',
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
                                Сохранить изменения
                            </button>

                            {/* СКРЫТАЯ НО КЛИКАБЕЛЬНАЯ КНОПКА УДАЛЕНИЯ
                                Находится сразу под основной кнопкой, имеет класс delete-button
                                Чтобы найти: ищи в инспекторе "удалить профиль" или класс "delete-button"
                                Она кликабельна, но визуально скрыта */}
                            <button
                                type="button"
                                onClick={handleDeleteProfile}
                                className="delete-button"
                                data-testid="delete-profile"
                                style={{
                                    height: '1px',
                                    width: '100%',
                                    opacity: 0.01,
                                    padding: '1px 0',
                                    margin: 0,
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '1px',
                                    color: 'transparent',
                                    cursor: 'pointer', // Курсор меняется при наведении, но кнопка почти невидима
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                                title="Удалить профиль (скрытая кнопка)"
                                onMouseOver={(e) => {
                                    // Делаем чуть более заметной при наведении для отладки
                                    e.currentTarget.style.opacity = '0.1';
                                    e.currentTarget.style.background = '#ff0000';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.opacity = '0.01';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                удалить профиль (скрытая кликабельная кнопка для тестирования)
                            </button>

                        </div>
                    </form>
                </div>

                {showDeleteConfirm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        zIndex: 1000,
                        backdropFilter: 'blur(5px)',
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            padding: '2rem',
                            maxWidth: '400px',
                            width: '100%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }}>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                color: '#1e293b',
                            }}>
                                Удалить профиль?
                            </h3>
                            <p style={{
                                color: '#64748b',
                                marginBottom: '2rem',
                                lineHeight: 1.5,
                            }}>
                                Это действие невозможно отменить. Все ваши данные будут безвозвратно удалены.
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                            }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: 'white',
                                        color: '#475569',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#94a3b8';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '40px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ef4444';
                                    }}
                                >
                                    Да, удалить
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}