import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        birthDate: '',
        agree: false,
    });
    const [error, setError] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (form.password.length < 8) errs.password = 'Минимум 8 символов';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Пароли не совпадают';
        if (!/^\+7\d{10}$/.test(form.phone)) errs.phone = 'Формат: +7XXXXXXXXXX';
        const birth = new Date(form.birthDate);
        const age = (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18 || age > 100) errs.birthDate = 'Возраст 18–100 лет';
        if (!form.agree) errs.agree = 'Необходимо согласие';
        if (Object.keys(errs).length) {
            setError(errs);
            return;
        }
        setError({});
        try {
            await register({
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                phone: form.phone,
                birthDate: form.birthDate,
            });
            navigate('/login');
        } catch (err) {
            if (err instanceof ApiError && err.body?.details?.field) {
                setError(err.body.details.field as Record<string, string>);
            } else {
                setError({ email: (err as Error).message });
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
            {/* Карточка с формой */}
            <div style={{
                maxWidth: '520px',
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

                {/* Заголовок */}
                <h1 style={{
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #1e2b3a 0%, #2d3e5a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    Создать аккаунт
                </h1>
                <p style={{
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '1rem',
                }}>
                    Зарегистрируйтесь в Buggy Insurance
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="email" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Email *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
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
                        {error.email && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#ef4444',
                            }}>{error.email}</p>
                        )}
                    </div>

                    {/* Пароль */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Пароль *
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
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
                        {error.password && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#ef4444',
                            }}>{error.password}</p>
                        )}
                    </div>

                    {/* Подтверждение пароля */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirmPassword" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Подтверждение пароля *
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
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
                        {error.confirmPassword && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#ef4444',
                            }}>{error.confirmPassword}</p>
                        )}
                    </div>

                    {/* ФИО */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="fullName" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            ФИО *
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={handleChange}
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

                    {/* Телефон */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="phone" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Телефон *
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+79001234567"
                            value={form.phone}
                            onChange={handleChange}
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
                        {error.phone && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#ef4444',
                            }}>{error.phone}</p>
                        )}
                    </div>

                    {/* Дата рождения */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="birthDate" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2d3e5a',
                        }}>
                            Дата рождения *
                        </label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={form.birthDate}
                            onChange={handleChange}
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
                                fontFamily: 'inherit',
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
                        {error.birthDate && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#ef4444',
                            }}>{error.birthDate}</p>
                        )}
                    </div>

                    {/* Чекбокс согласия */}
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                    }}>
                        <input
                            id="agree"
                            name="agree"
                            type="checkbox"
                            checked={form.agree}
                            onChange={handleChange}
                            style={{
                                width: '1.2rem',
                                height: '1.2rem',
                                marginTop: '0.2rem',
                                cursor: 'pointer',
                                accentColor: '#667eea',
                            }}
                        />
                        <label htmlFor="agree" style={{
                            color: '#475569',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}>
                            Согласен с условиями оферты *
                        </label>
                    </div>
                    {error.agree && (
                        <p style={{
                            marginTop: '-0.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem',
                            color: '#ef4444',
                        }}>{error.agree}</p>
                    )}

                    {/* Кнопка регистрации */}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '40px',
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
                        Зарегистрироваться
                    </button>
                </form>

                {/* Ссылка на вход */}
                <p style={{
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: 0,
                }}>
                    Уже есть аккаунт?{' '}
                    <Link
                        to="/login"
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
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}