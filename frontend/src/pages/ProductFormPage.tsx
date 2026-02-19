import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationsApi, productsApi } from '../api/endpoints'
import type { FormField, Product } from '../types'

const PRODUCT_NAMES: Record<string, string> = {
  AUTO: 'ОСАГО/КАСКО',
  HOME: 'Жильё',
  LIFE: 'Жизнь',
  HEALTH: 'Здоровье (ДМС)',
  TRAVEL: 'Путешествия',
}

const CAR_MODELS: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
  Honda: ['Accord', 'Civic', 'CR-V', 'Pilot'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE'],
}

const COUNTRIES = ['Thailand', 'Turkey', 'Egypt', 'Spain', 'Italy', 'France', 'USA', 'UAE']

const BASE_PRICES: Record<string, number> = {
  AUTO: 5000,
  HOME: 3000,
  LIFE: 10000,
  HEALTH: 15000,
  TRAVEL: 1500,
}

function calculatePrice(
  productType: string,
  formData: Record<string, string | number | boolean>,
  basePrice: number
): number {
  const v = (k: string) => formData[k]
  let p = basePrice

  if (productType === 'AUTO') {
    const brand = v('brand') as string
    if (brand === 'BMW' || brand === 'Mercedes') p *= 1.3
    const year = Number(v('year')) || new Date().getFullYear()
    const curYear = new Date().getFullYear()
    p += Math.max(0, (curYear - year) * -500)
    const insType = v('insuranceType') as string
    if (insType === 'KASKO') p *= 3
    else if (insType === 'BOTH') p *= 4
    const exp = Number(v('drivingExperience')) ?? 5
    if (exp < 3) p *= 1.4
    else if (exp < 6) p *= 1.2
  }

  if (productType === 'HOME') {
    if (v('propertyType') === 'house') p *= 1.2
    const area = Number(v('area')) || 50
    p += area * 30
    const cov = Number(v('coverageAmount')) || 0
    p += cov * 0.0001
    const buildYear = Number(v('buildYear')) || 2000
    const curYear = new Date().getFullYear()
    if (curYear - buildYear < 5) p *= 1.1
  }

  if (productType === 'LIFE') {
    const age = Number(v('age')) || 30
    if (age > 50) p *= 1.5
    else if (age > 35) p *= 1.2
    if (v('smoking') === true) p *= 1.25
    if (v('chronicDiseases') === true) p *= 1.2
    const term = v('termYears') as string
    if (term === '3') p *= 2.5
    else if (term === '5') p *= 4
    else if (term === '10') p *= 7
    const cov = Number(v('coverageAmount')) || 1000000
    p *= Math.max(0.5, Math.min(2, cov / 1000000))
  }

  if (productType === 'HEALTH') {
    const prog = v('program') as string
    if (prog === 'extended') p *= 1.5
    else if (prog === 'premium') p *= 2
    const age = Number(v('age')) || 40
    if (age > 60) p *= 1.3
    else if (age > 45) p *= 1.1
    if (v('dentistry') === true) p *= 1.15
    if (v('hospitalization') === true) p *= 1.25
  }

  if (productType === 'TRAVEL') {
    const cov = v('coverageAmount') as string
    if (cov === '50000') p *= 1.5
    else if (cov === '100000') p *= 2
    const travelers = Number(v('travelers')) || 1
    p *= travelers
    if (v('activeLeisure') === true) p *= 1.3
    const start = v('startDate') as string
    const end = v('endDate') as string
    if (start && end) {
      const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
      p *= Math.max(1, days / 7)
    }
  }

  return Math.round(Math.max(0, p))
}

type ProductWithForm = {
  products: Product[]
  formFields?: FormField[]
}

export default function ProductFormPage() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductWithForm | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({})
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const productType = (type || '').toUpperCase()

  useEffect(() => {
    if (!productType) return
    productsApi.getByType(productType)
      .then((res) => {
        setProduct(res)
        const initial: Record<string, string | number | boolean> = {}
        ;(res.formFields || []).forEach((f) => {
          if (f.type === 'checkbox') {
            initial[f.name] = false
          } else if (f.type === 'number') {
            initial[f.name] = typeof f.min === 'number' ? f.min : 0
          } else {
            initial[f.name] = ''
          }
        })
        setFormData(initial)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [productType])

  const basePrice = product?.products?.[0]?.basePrice ?? BASE_PRICES[productType] ?? 5000

  useEffect(() => {
    const p = calculatePrice(productType, formData, basePrice)
    setPrice(p)
  }, [formData, productType, basePrice])

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    let productId = product?.products?.[0]?.id
    if (!productId) {
      try {
        const { products } = await productsApi.getAll()
        const found = products.find((p) => p.type === productType)
        productId = found?.id
      } catch {
        setError('Не удалось определить продукт. Обратитесь в поддержку.')
        return
      }
    }
    if (!productId) {
      setError('Продукт не найден')
      return
    }
    const managerId = 5
    const data: Record<string, unknown> = {}
    Object.entries(formData).forEach(([k, v]) => {
      data[k] = v
    })
    try {
      await applicationsApi.create(productType, productId, managerId, data)
      navigate('/dashboard')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <div className="container">Загрузка...</div>
  if (!product || !product.formFields?.length) return <div className="container">Нет данных для оформления</div>

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.visibleIf) return true
    return Object.entries(field.visibleIf).every(([depName, depValue]) => {
      return String(formData[depName] ?? '') === String(depValue)
    })
  }

  const renderField = (field: FormField) => {
    const { name, type: fieldType, label, required } = field
    const val = formData[name]

    if (fieldType === 'select') {
      let options: string[] = field.options || []

      if (name === 'model') {
        const brand = formData.brand as string
        options = brand ? CAR_MODELS[brand] || [] : []
      } else if (name === 'country' && options.length === 0) {
        options = COUNTRIES
      }

      return (
        <div key={name} className="form-group">
          <label>{label} {required && '*'}</label>
          <select
            value={String(val)}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            disabled={field.dependsOn ? !formData[field.dependsOn] : false}
          >
            <option value="">— Выберите —</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )
    }
    if (fieldType === 'radio') {
      const options = field.options || []
      return (
        <div key={name} className="form-group">
          <label>{label} {required && '*'}</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {options.map((o) => (
              <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="radio"
                  name={name}
                  value={o}
                  checked={val === o}
                  onChange={() => handleChange(name, o)}
                  style={{ width: 'auto' }}
                />
                {o}
              </label>
            ))}
          </div>
        </div>
      )
    }
    if (fieldType === 'checkbox') {
      return (
        <div key={name} className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={!!val}
              onChange={(e) => handleChange(name, e.target.checked)}
              style={{ width: 'auto' }}
            />
            {label}
          </label>
        </div>
      )
    }
    if (fieldType === 'textarea') {
      return (
        <div key={name} className="form-group">
          <label>{label} {required && '*'}</label>
          <textarea
            value={String(val)}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            rows={3}
          />
        </div>
      )
    }
    const inputType = fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'

    const commonProps: React.InputHTMLAttributes<HTMLInputElement> = {}
    if (fieldType === 'number') {
      if (typeof field.min === 'number') commonProps.min = field.min
      if (typeof field.max === 'number') commonProps.max = field.max
    }
    if (fieldType === 'text') {
      if (typeof field.minLength === 'number') commonProps.minLength = field.minLength
      if (typeof field.maxLength === 'number') commonProps.maxLength = field.maxLength
      if (field.pattern) commonProps.pattern = field.pattern
    }
    if (fieldType === 'date') {
      const today = new Date().toISOString().slice(0, 10)
      if (field.minDate === 'today') {
        commonProps.min = today
      } else if (field.minDate) {
        commonProps.min = field.minDate
      }
      if (field.maxDate) {
        commonProps.max = field.maxDate
      }
      if (field.after && typeof formData[field.after] === 'string' && formData[field.after]) {
        commonProps.min = String(formData[field.after])
      }
    }

    return (
      <div key={name} className="form-group">
        <label>{label} {required && '*'}</label>
        <input
          type={inputType}
          value={String(val)}
          onChange={(e) => handleChange(name, fieldType === 'number' ? Number(e.target.value) : e.target.value)}
          required={required}
          {...commonProps}
        />
      </div>
    )
  }

  const formFields = product.formFields || []
  const products = product.products || []

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: '1rem' }}>{PRODUCT_NAMES[productType] || productType}</h1>

      {products.length > 0 && (
        <section className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Продукты</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{p.name}</div>
                {p.description && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    {p.description}
                  </div>
                )}
                <div style={{ fontSize: '0.95rem' }}>от {p.basePrice} ₽/мес</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Оставить заявку</h2>
        <form onSubmit={handleSubmit}>
          {formFields.map((f) => {
            if (!isFieldVisible(f)) return null
            return renderField(f)
          })}
          <div className="form-group" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Итоговая стоимость: {price.toLocaleString('ru-RU')} ₽
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Оформить заявку</button>
        </form>
      </section>
    </div>
  )
}
