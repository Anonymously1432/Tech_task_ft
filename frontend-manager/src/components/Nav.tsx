import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Nav() {
  const { user, logout } = useAuth()

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
        to="/dashboard"
        style={{
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'var(--color-primary)',
          textDecoration: 'none',
        }}
      >
        Buggy Insurance — Manager
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {!user ? (
          <Link to="/login">Вход</Link>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/applications">Заявки</Link>
            <Link to="/statistics">Статистика</Link>
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
