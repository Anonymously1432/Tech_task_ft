import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
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
            background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f0f9 100%)',
            padding: '1rem',
        }}>
            {/* Карточка с формой - вдохновлено zachet.app и sptnk.pro */}
            <div style={{
                maxWidth: '440px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '40px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                padding: '2.5rem 2rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
                 onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'translateY(-4px)';
                     e.currentTarget.style.boxShadow = '0 30px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)';
                 }}
                 onMouseOut={(e) => {
                     e.currentTarget.style.transform = '';
                     e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02)';
                 }}>

                {/* Заголовок с градиентом */}
                <h1 style={{
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #1e2b3a 0%, #2d3e5a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    Добро пожаловать
                </h1>
                <p style={{
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '1rem',
                }}>
                    Войдите в свой аккаунт Buggy Insurance
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Поле Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="email"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: '#2d3e5a',
                            }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
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

                    {/* Поле Пароль */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: '#2d3e5a',
                            }}
                        >
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
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

                    {/* Чекбокс "Запомнить меня" */}
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <input
                            id="remember"
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            style={{
                                width: '1.2rem',
                                height: '1.2rem',
                                cursor: 'pointer',
                                accentColor: '#667eea', // Для красивого цвета в современных браузерах
                            }}
                        />
                        <label
                            htmlFor="remember"
                            style={{
                                color: '#475569',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                userSelect: 'none',
                            }}
                        >
                            Запомнить меня
                        </label>
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
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Кнопка входа - градиентная, как на главной */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px -8px rgba(102, 126, 234, 0.5)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            marginBottom: '1.5rem',
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
                        Войти
                    </button>
                </form>

                {/* Ссылка на регистрацию */}
                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: 0,
                }}>
                    Нет аккаунта?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#764ba2';
                            e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = '#667eea';
                            e.currentTarget.style.textDecoration = 'none';
                        }}
                    >
                        Регистрация
                    </Link>
                </p>
            </div>
        </div>
    );
}