import {useCallback, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../api/endpoints'
import type { Product } from '../types'

const ICON_BY_TYPE: Record<string, { icon: string }> = {
  AUTO: { icon: '🚗' },
  HOME: { icon:'🏠' },
  LIFE: { icon: '❤️' },
  HEALTH: { icon: '🏥' },
  TRAVEL: { icon: '🏥' },
}

const PRODUCT_TITLE_BY_TYPE: Record<string, string> = {
    AUTO: 'Автострахование',
    HOME: 'Страхование жилья',
    LIFE: 'Страхование жизни',
    HEALTH: 'Медицинское страхование',
    TRAVEL: 'Страхование путешествий',
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

    const getIcon = useCallback((productType: string) => {
        try {
            return  ICON_BY_TYPE[productType].icon
        } catch (e) {
            console.error(e)
        }
       }, [])

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>
  if (error) return <div className="container" style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</div>

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Наши продукты</h1>
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1rem',
            }}
        >
            {products.map((product) => (
                <div
                    key={product.id}
                    className="card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {getIcon(product.type)}
                    </div>

                    <h3 style={{ margin: '0 0 0.5rem 0' }}>
                        {PRODUCT_TITLE_BY_TYPE[product.type] ?? product.name}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        {product.description}
                    </p>

                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                        от {Number(product.basePrice).toLocaleString('ru-RU')} ₽/мес
                    </p>

                    <Link
                        to={`/products/${product.type}`}
                        className="btn btn-primary"
                        style={{ marginTop: 'auto' }}
                    >
                        Подробнее
                    </Link>
                </div>
            ))}
      </div>
    </div>
  )
}
