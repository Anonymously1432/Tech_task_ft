import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Nav() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Функция для проверки активной ссылки
    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        }}>
            {/* Логотип */}
            <Link
                to="/"
                style={{
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textDecoration: 'none',
                    letterSpacing: '-0.5px',
                }}
            >
                Buggy Insurance
            </Link>

            {/* Навигационные ссылки */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
            }}>
                {!user ? (
                    // Ссылки для неавторизованных пользователей
                    <>
                        <NavLink to="/products" isActive={isActive('/products')}>
                            Продукты
                        </NavLink>
                        <NavLink to="/login" isActive={isActive('/login')}>
                            Вход
                        </NavLink>
                        <NavLink to="/register" isActive={isActive('/register')} isButton>
                            Регистрация
                        </NavLink>
                    </>
                ) : (
                    // Ссылки для авторизованных пользователей
                    <>
                        <NavLink to="/products" isActive={isActive('/products')}>
                            Продукты
                        </NavLink>
                        <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                            Дашборд
                        </NavLink>
                        <NavLink to="/policies" isActive={isActive('/policies')}>
                            Мои полисы
                        </NavLink>
                        <NavLink to="/profile" isActive={isActive('/profile')}>
                            Профиль
                        </NavLink>

                        {/* Кнопка выхода */}
                        <button
                            onClick={logout}
                            style={{
                                background: 'transparent',
                                color: '#64748b',
                                padding: '0.5rem 1.2rem',
                                borderRadius: '30px',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                border: '2px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginLeft: '0.5rem',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#ef4444';
                                e.currentTarget.style.color = '#ef4444';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#64748b';
                            }}
                        >
                            Выйти
                        </button>
                    </>
                )}
            </div>

            {/* Медиа-запрос для мобильных устройств */}
            <style>{`
        @media (max-width: 768px) {
          nav {
            padding: 0.75rem 1rem !important;
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          
          nav > div {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
        </nav>
    );
}

// Компонент для стилизованной ссылки
function NavLink({
                     to,
                     children,
                     isActive,
                     isButton = false
                 }: {
    to: string;
    children: React.ReactNode;
    isActive: boolean;
    isButton?: boolean;
}) {
    if (isButton) {
        return (
            <Link
                to={to}
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '30px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.3)';
                }}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            to={to}
            style={{
                color: isActive ? '#667eea' : '#475569',
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
            }}
            onMouseOver={(e) => {
                if (!isActive) {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                }
            }}
            onMouseOut={(e) => {
                if (!isActive) {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
        >
            {children}
        </Link>
    );
}