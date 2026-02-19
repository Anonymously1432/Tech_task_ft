import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../api/endpoints'
import type { Product } from '../types'

// Bug #1: lookup для иконок. TRAVEL намеренно отсутствует — API не возвращает icon для TRAVEL, при обращении meta.icon для TRAVEL meta=undefined → TypeError
const ICON_BY_TYPE: Record<string, { icon: string }> = {
  AUTO: { icon: 'car' },
  HOME: { icon: 'home' },
  LIFE: { icon: 'heart' },
  HEALTH: { icon: 'medical' },
  TRAVEL: { icon: 'plane' },
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    productsApi.getAll()
      .then((res) => setProducts(res.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>
  if (error) return <div className="container" style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</div>

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Наши продукты</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product.id} className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {/* Bug #1: ICON_BY_TYPE[product.type] для TRAVEL = undefined, .icon вызовет TypeError */}
              {ICON_BY_TYPE[product.type].icon}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              {product.description}
            </p>
            <p style={{ fontWeight: 600, marginBottom: '1rem' }}>от {product.basePrice} ₽/мес</p>
            <Link to={`/products/${product.type}`} className="btn btn-primary" style={{ display: 'inline-block' }}>
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
