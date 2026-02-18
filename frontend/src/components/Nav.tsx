import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Nav() {
  const { user, logout, isManager } = useAuth()
  const loc = useLocation()
  const isManagerArea = loc.pathname.startsWith('/manager')

  return (
    <nav
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        to={isManagerArea ? '/manager/dashboard' : '/'}
        style={{
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'var(--color-primary)',
          textDecoration: 'none',
        }}
      >
        Buggy Insurance
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {!user ? (
          !isManagerArea ? (
            <>
              <Link to="/products">Продукты</Link>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          ) : (
            <Link to="/manager/login">Вход</Link>
          )
        ) : isManager ? (
          <>
            <Link to="/manager/dashboard">Dashboard</Link>
            <Link to="/manager/applications">Заявки</Link>
            <Link to="/manager/statistics">Статистика</Link>
            <button
              className="btn btn-outline"
              onClick={logout}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/products">Продукты</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/policies">Мои полисы</Link>
            <Link to="/profile">Профиль</Link>
            <button
              className="btn btn-outline"
              onClick={logout}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            >
              Выйти
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
