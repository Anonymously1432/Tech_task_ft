import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(email, password);
            if (res.user.role === 'manager') {
                navigate('/dashboard');
            } else {
                setError('Доступ только для менеджеров');
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.body?.error || err.message);
            } else {
                setError('Ошибка входа');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f1f4f9 0%, #e9ecf5 100%)',
            padding: '1rem',
        }}>
            {/* Карточка с формой */}
            <div style={{
                maxWidth: '440px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(79, 91, 213, 0.1)',
                padding: '2.5rem 2rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
                 onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-4px)';
                     e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(79, 91, 213, 0.2), 0 0 0 1px rgba(79, 91, 213, 0.2)';
                 }}
                 onMouseOut={(e) => {
                     e.currentTarget.style.transform = '';
                     e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(79, 91, 213, 0.1)';
                 }}>

                {/* Заголовок с бейджем */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #2d3e5a 0%, #1e2b3a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Вход для менеджера
                    </h1>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 1rem',
                        backgroundColor: 'rgba(79, 91, 213, 0.1)',
                        color: '#4f5bd5',
                        borderRadius: '30px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginTop: '0.5rem',
                    }}>
                        🔐 Только для сотрудников
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Поле Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="email" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="manager@buggy-insurance.ru"
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
                                e.currentTarget.style.borderColor = '#4f5bd5';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 91, 213, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Поле Пароль */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
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
                                e.currentTarget.style.borderColor = '#4f5bd5';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 91, 213, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Ошибка */}
                    {error && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #FECACA',
                            borderRadius: '16px',
                            color: '#991B1B',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Кнопка входа */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #4f5bd5 0%, #962fbf 100%)',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '40px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px -8px rgba(79, 91, 213, 0.5)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            marginBottom: '1rem',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 25px -8px rgba(79, 91, 213, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(79, 91, 213, 0.5)';
                        }}
                    >
                        Войти в панель менеджера
                    </button>
                </form>

                {/* Подсказка для тестирования */}
                <p style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    margin: '1rem 0 0 0',
                    borderTop: '1px dashed #e2e8f0',
                    paddingTop: '1rem',
                }}>
                    Только для авторизованных менеджеров
                </p>
            </div>
        </div>
    );
}