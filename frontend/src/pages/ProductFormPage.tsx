import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationsApi, productsApi } from '../api/endpoints'

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

export default function ProductFormPage() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<{ products: { id: number; basePrice: number }[]; formFields?: { name: string; type: string; label: string; required: boolean; options?: string[]; min?: number; max?: number }[] } | null>(null)
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
        setPrice(res.products[0]?.basePrice || 0)
        const initial: Record<string, string | number | boolean> = {}
        ;(res.formFields || []).forEach((f) => {
          if (f.type === 'checkbox') initial[f.name] = false
          else if (f.type === 'number') initial[f.name] = f.min || 0
          else initial[f.name] = ''
        })
        setFormData(initial)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [productType])

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      let p = product?.products[0]?.basePrice || 0
      if (productType === 'LIFE' && name === 'smoking' && value === true) p *= 1.25
      if (productType === 'LIFE' && name === 'chronicDiseases' && value === true) p *= 1.2
      setPrice(Math.round(p))
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!product?.products[0]) return
    const productId = product.products[0].id
    const managerId = 10
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
  if (!product || !product.products.length) return <div className="container">Продукт не найден</div>

  const renderField = (name: string, fieldType: string, label: string, required: boolean, opts?: { options?: string[]; min?: number; max?: number }) => {
    const val = formData[name]
    if (fieldType === 'select') {
      const options = opts?.options || (name === 'model' && typeof formData.brand === 'string' ? CAR_MODELS[formData.brand] || [] : []) || (name === 'country' ? COUNTRIES : [])
      return (
        <div key={name} className="form-group">
          <label>{label} {required && '*'}</label>
          <select
            value={String(val)}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
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
      const options = opts?.options || []
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
    return (
      <div key={name} className="form-group">
        <label>{label} {required && '*'}</label>
        <input
          type={inputType}
          value={String(val)}
          onChange={(e) => handleChange(name, fieldType === 'number' ? Number(e.target.value) : e.target.value)}
          required={required}
          min={opts?.min}
          max={opts?.max}
        />
      </div>
    )
  }

  const formFields = product.formFields || []

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: '1rem' }}>{PRODUCT_NAMES[productType] || productType}</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {formFields.map((f) => {
            if (f.name === 'model') {
              const brand = formData.brand as string
              const models = brand ? (CAR_MODELS[brand] || []) : []
              return renderField(f.name, f.type, f.label, f.required, { options: models })
            }
            return renderField(f.name, f.type, f.label, f.required, f)
          })}
          <div className="form-group" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Итоговая стоимость: {price.toLocaleString('ru-RU')} ₽
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Оформить заявку</button>
        </form>
      </div>
    </div>
  )
}
