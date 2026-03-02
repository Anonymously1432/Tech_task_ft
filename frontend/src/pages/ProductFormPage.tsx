import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsApi, productsApi } from '../api/endpoints';
import type { FormField, Product } from '../types';

const PRODUCT_NAMES: Record<string, string> = {
    AUTO: 'ОСАГО/КАСКО',
    HOME: 'Жильё',
    LIFE: 'Жизнь',
    HEALTH: 'Здоровье (ДМС)',
    TRAVEL: 'Путешествия',
};

// Иконки для типов продуктов
const PRODUCT_ICONS: Record<string, string> = {
    AUTO: '🚗',
    HOME: '🏠',
    LIFE: '❤️',
    HEALTH: '🏥',
    TRAVEL: '✈️',
};

const CAR_MODELS: Record<string, string[]> = {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
    Honda: ['Accord', 'Civic', 'CR-V', 'Pilot'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Mercedes: ['C-Класс', 'E-Класс', 'GLC', 'GLE'],
};

const COUNTRIES = ['Тайланд', 'Турция', 'Египет', 'Испания', 'Италия', 'Франция', 'США', 'ОАЭ'];

const BASE_PRICES: Record<string, number> = {
    AUTO: 5000,
    HOME: 3000,
    LIFE: 10000,
    HEALTH: 15000,
    TRAVEL: 1500,
};

function calculatePrice(
    productType: string,
    formData: Record<string, string | number | boolean>,
    basePrice: number
): number {
    const v = (k: string) => formData[k];
    let p = basePrice;

    if (productType === 'AUTO') {
        const brand = v('brand') as string;
        if (brand === 'BMW' || brand === 'Mercedes') p *= 1.3;
        const year = Number(v('year')) || new Date().getFullYear();
        const curYear = new Date().getFullYear();
        p += Math.max(0, (curYear - year) * -500);
        const insType = v('insuranceType') as string;
        if (insType === 'KASKO') p *= 3;
        else if (insType === 'BOTH') p *= 4;
        const exp = Number(v('drivingExperience')) ?? 5;
        if (exp < 3) p *= 1.4;
        else if (exp < 6) p *= 1.2;
    }

    if (productType === 'HOME') {
        if (v('propertyType') === 'house') p *= 1.2;
        const area = Number(v('area')) || 50;
        p += area * 30;
        const cov = Number(v('coverageAmount')) || 0;
        p += cov * 0.0001;
        const buildYear = Number(v('buildYear')) || 2000;
        const curYear = new Date().getFullYear();
        if (curYear - buildYear < 5) p *= 1.1;
    }

    if (productType === 'LIFE') {
        const age = Number(v('age')) || 30;
        if (age > 50) p *= 1.5;
        else if (age > 35) p *= 1.2;
        if (v('chronicDiseases') === true) p *= 1.2;
        const term = v('termYears') as string;
        if (term === '3') p *= 2.5;
        else if (term === '5') p *= 4;
        else if (term === '10') p *= 7;
        const cov = Number(v('coverageAmount')) || 1000000;
        p *= Math.max(0.5, Math.min(2, cov / 1000000));
    }

    if (productType === 'HEALTH') {
        const prog = v('program') as string;
        if (prog === 'extended') p *= 1.5;
        else if (prog === 'premium') p *= 2;
        const age = Number(v('age')) || 40;
        if (age > 60) p *= 1.3;
        else if (age > 45) p *= 1.1;
        if (v('dentistry') === true) p *= 1.15;
        if (v('hospitalization') === true) p *= 1.25;
    }

    if (productType === 'TRAVEL') {
        const cov = v('coverageAmount') as string;
        if (cov === '50000') p *= 1.5;
        else if (cov === '100000') p *= 2;
        const travelers = Number(v('travelers')) || 1;
        p *= travelers;
        if (v('activeLeisure') === true) p *= 1.3;
        const start = v('startDate') as string;
        const end = v('endDate') as string;
        if (start && end) {
            const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
            p *= Math.max(1, days / 7);
        }
    }

    return Math.round(Math.max(0, p));
}

type ProductWithForm = {
    products: Product[];
    formFields?: FormField[];
};

export default function ProductFormPage() {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductWithForm | null>(null);
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const productType = (type || '').toUpperCase();

    useEffect(() => {
        if (!productType) return;
        productsApi.getByType(productType)
            .then((res) => {
                setProduct(res);
                const initial: Record<string, string | number | boolean> = {};
                (res.formFields || []).forEach((f) => {
                    if (f.type === 'checkbox') {
                        initial[f.name] = false;
                    } else if (f.type === 'number') {
                        initial[f.name] = typeof f.min === 'number' ? f.min : 0;
                    } else {
                        initial[f.name] = '';
                    }
                });
                setFormData(initial);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [productType]);

    const basePrice = product?.products?.[0]?.basePrice ?? BASE_PRICES[productType] ?? 5000;

    useEffect(() => {
        const p = calculatePrice(productType, formData, basePrice);
        setPrice(p);
    }, [formData, productType, basePrice]);

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let productId = product?.products?.[0]?.id;
        if (!productId) {
            try {
                const { products } = await productsApi.getAll();
                const found = products.find((p) => p.type === productType);
                productId = found?.id;
            } catch {
                setError('Не удалось определить продукт. Обратитесь в поддержку.');
                return;
            }
        }
        if (!productId) {
            setError('Продукт не найден');
            return;
        }
        const managerId = 5;
        const data: Record<string, unknown> = {};
        Object.entries(formData).forEach(([k, v]) => {
            data[k] = v;
        });
        try {
            await applicationsApi.create(productType, productId, managerId, data);
            navigate('/dashboard');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    if (loading) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#64748b',
        }}>
            Загрузка формы...
        </div>
    );

    if (!product || !product.formFields?.length) return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
        }}>
            Нет данных для оформления
        </div>
    );

    const isFieldVisible = (field: FormField): boolean => {
        if (!field.visibleIf) return true;
        return Object.entries(field.visibleIf).every(([depName, depValue]) => {
            return String(formData[depName] ?? '') === String(depValue);
        });
    };

    const renderField = (field: FormField) => {
        const { name, type: fieldType, label, required, placeholder } = field;
        const val = formData[name];

        if (fieldType === 'select') {
            let options: string[] = field.options || [];

            if (name === 'model') {
                const brand = formData.brand as string;
                options = brand ? CAR_MODELS[brand] || [] : [];
            } else if (name === 'country' && options.length === 0) {
                options = COUNTRIES;
            }

            return (
                <div key={name} style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#2d3e5a',
                    }}>
                        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <select
                        value={String(val)}
                        onChange={(e) => handleChange(name, e.target.value)}
                        required={required}
                        disabled={field.dependsOn ? !formData[field.dependsOn] : false}
                        style={{
                            width: '100%',
                            padding: '0.9rem 1.2rem',
                            fontSize: '1rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '16px',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <option value="">— Выберите —</option>
                        {options.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (fieldType === 'radio') {
            const options = field.options || [];
            return (
                <div key={name} style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#2d3e5a',
                    }}>
                        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {options.map((o) => (
                            <label key={o} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                color: '#475569',
                            }}>
                                <input
                                    type="radio"
                                    name={name}
                                    value={o}
                                    checked={val === o}
                                    onChange={() => handleChange(name, o)}
                                    style={{
                                        width: '1.1rem',
                                        height: '1.1rem',
                                        cursor: 'pointer',
                                        accentColor: '#667eea',
                                    }}
                                />
                                {o}
                            </label>
                        ))}
                    </div>
                </div>
            );
        }

        if (fieldType === 'checkbox') {
            return (
                <div key={name} style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        color: '#475569',
                    }}>
                        <input
                            type="checkbox"
                            checked={!!val}
                            onChange={(e) => handleChange(name, e.target.checked)}
                            style={{
                                width: '1.2rem',
                                height: '1.2rem',
                                cursor: 'pointer',
                                accentColor: '#667eea',
                            }}
                        />
                        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                </div>
            );
        }

        if (fieldType === 'textarea') {
            return (
                <div key={name} style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: '#2d3e5a',
                    }}>
                        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <textarea
                        value={String(val)}
                        onChange={(e) => handleChange(name, e.target.value)}
                        required={required}
                        rows={3}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            padding: '0.9rem 1.2rem',
                            fontSize: '1rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            outline: 'none',
                            resize: 'vertical',
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
                </div>
            );
        }

        const inputType = fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text';

        const commonProps: React.InputHTMLAttributes<HTMLInputElement> = {};
        if (fieldType === 'number') {
            if (typeof field.min === 'number') commonProps.min = field.min;
            if (typeof field.max === 'number') commonProps.max = field.max;
        }
        if (fieldType === 'text') {
            if (typeof field.minLength === 'number') commonProps.minLength = field.minLength;
            if (typeof field.maxLength === 'number') commonProps.maxLength = field.maxLength;
            if (field.pattern) commonProps.pattern = field.pattern;
        }
        if (fieldType === 'date') {
            const today = new Date().toISOString().slice(0, 10);
            if (field.minDate === 'today') {
                commonProps.min = today;
            } else if (field.minDate) {
                commonProps.min = field.minDate;
            }
            if (field.maxDate) {
                commonProps.max = field.maxDate;
            }
            if (field.after && typeof formData[field.after] === 'string' && formData[field.after]) {
                commonProps.min = String(formData[field.after]);
            }
        }

        return (
            <div key={name} style={{ marginBottom: '1.5rem' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#2d3e5a',
                }}>
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                    type={inputType}
                    value={String(val)}
                    onChange={(e) => handleChange(name, fieldType === 'number' ? Number(e.target.value) : e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    {...commonProps}
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
        );
    };

    const formFields = product.formFields || [];
    const products = product.products || [];
    const icon = PRODUCT_ICONS[productType] || '📄';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f9fafc 0%, #f1f5f9 100%)',
            paddingTop: '3rem',
            paddingBottom: '4rem',
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Заголовок с иконкой */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #667eea20 0%, #764ba240 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                    }}>
                        {icon}
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 700,
                            marginBottom: '0.25rem',
                            color: '#1e293b',
                        }}>
                            {PRODUCT_NAMES[productType] || productType}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            Заполните форму для оформления страховки
                        </p>
                    </div>
                </div>

                {/* Блок с продуктами */}
                {products.length > 0 && (
                    <div style={{
                        marginBottom: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '28px',
                        border: '1px solid #e9eef2',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e9eef2',
                            backgroundColor: '#f8fafc',
                        }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                margin: 0,
                                color: '#1e293b',
                            }}>
                                Доступные продукты
                            </h2>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {products.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            padding: '1rem',
                                            background: '#f8fafc',
                                            borderRadius: '20px',
                                            border: '1px solid #e2e8f0',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.5rem',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                        }}>
                                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</span>
                                            <span style={{
                                                fontWeight: 700,
                                                color: '#667eea',
                                                background: '#e9efff',
                                                padding: '0.25rem 1rem',
                                                borderRadius: '30px',
                                                fontSize: '0.9rem',
                                            }}>
                        от {new Intl.NumberFormat('ru-RU').format(p.basePrice)} ₽/мес
                      </span>
                                        </div>
                                        {p.description && (
                                            <p style={{
                                                fontSize: '0.9rem',
                                                color: '#64748b',
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}>
                                                {p.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Форма */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    border: '1px solid #e9eef2',
                    boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid #e9eef2',
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            margin: 0,
                            color: '#1e293b',
                        }}>
                            Оставить заявку
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                        {formFields.map((f) => {
                            if (!isFieldVisible(f)) return null;
                            return renderField(f);
                        })}

                        {/* Итоговая стоимость */}
                        <div style={{
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
                            borderRadius: '28px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                Итоговая стоимость
                            </div>
                            <div style={{
                                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                                fontWeight: 700,
                                color: '#1e293b',
                            }}>
                                {price.toLocaleString('ru-RU')} ₽
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                в месяц
                            </div>
                        </div>

                        {/* Ошибка */}
                        {error && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem 1.25rem',
                                backgroundColor: '#FEE2E2',
                                border: '1px solid #FECACA',
                                borderRadius: '20px',
                                color: '#991B1B',
                                fontSize: '0.95rem',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '1.2rem 2rem',
                                borderRadius: '40px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 15px 25px -8px rgba(102, 126, 234, 0.5)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 20px 30px -8px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 15px 25px -8px rgba(102, 126, 234, 0.5)';
                            }}
                        >
                            Оформить заявку
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}