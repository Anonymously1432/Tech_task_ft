import { Link } from 'react-router-dom'

const PRODUCT_TYPES = [
  { type: 'AUTO', name: 'ОСАГО/КАСКО', desc: 'Страхование автомобиля', icon: '🚗' },
  { type: 'HOME', name: 'Жильё', desc: 'Защита недвижимости', icon: '🏠' },
  { type: 'LIFE', name: 'Жизнь', desc: 'Страхование жизни', icon: '❤️' },
  { type: 'HEALTH', name: 'Здоровье (ДМС)', desc: 'Медицинское страхование', icon: '🏥' },
  { type: 'TRAVEL', name: 'Путешествия', desc: 'Страхование выезжающих', icon: '✈️' },
]

export default function HomePage() {
  return (
    <div className="container">
      <section style={{ textAlign: 'center', padding: '3rem 1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Buggy Insurance</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Оформляйте страховку онлайн быстро и удобно
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary">Смотреть продукты</Link>
          <Link to="/login" className="btn btn-outline">Войти</Link>
          <Link to="/register" className="btn btn-secondary">Регистрация</Link>
        </div>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Наши преимущества</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <strong>Быстро</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Оформление за 5 минут</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
            <strong>Безопасно</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Ваши данные под защитой</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <strong>Выгодно</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>Конкурентные цены</p>
          </div>
        </div>
      </section>
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Типы страховок</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {PRODUCT_TYPES.map((p) => (
            <Link
              key={p.type}
              to={`/products/${p.type.toLowerCase()}`}
              className="card"
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.icon}</div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{p.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <footer style={{ marginTop: '4rem', padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>© Buggy Insurance. Контакты: support@buggy-insurance.ru</p>
      </footer>
    </div>
  )
}
