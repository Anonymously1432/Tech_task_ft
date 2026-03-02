import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PRODUCT_TYPES = [
    { type: 'AUTO', name: 'ОСАГО/КАСКО', desc: 'Страхование автомобиля по системам ОСАГО и КАСКО. Покрывает ответственность перед третьими лицами, а также риски повреждения, угона и полной гибели транспортного средства.', icon: '🚗' },
    { type: 'HOME', name: 'Жильё', desc: 'Страхование жилой недвижимости. Предусматривает защиту имущества от пожара, затопления, стихийных бедствий и противоправных действий третьих лиц.', icon: '🏠' },
    { type: 'LIFE', name: 'Жизнь', desc: 'Страхование жизни и здоровья застрахованного лица. Обеспечивает финансовую защиту при наступлении страховых случаев, связанных с утратой трудоспособности или смертью.', icon: '❤️' },
    { type: 'HEALTH', name: 'Здоровье (ДМС)', desc: 'Добровольное медицинское страхование. Включает получение медицинских услуг, диагностику, лечение и госпитализацию в рамках условий договора.', icon: '🏥' },
    { type: 'TRAVEL', name: 'Путешествия', desc:  'Страхование лиц, выезжающих за пределы постоянного места проживания. Покрывает медицинские расходы и иные риски на период поездки.', icon: '✈️' },
];

export default function HomePage() {
    const { user } = useAuth();

    // Базовые стили для градиентного текста (можно вынести в CSS)
    const gradientTextStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    return (
        // Добавляем общий контейнер с фоном и отступами
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* HERO СЕКЦИЯ - стиль как в sptnk.pro */}
            <section style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                marginBottom: '4rem',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e9eef5 100%)',
                borderRadius: '48px',
            }}>
                <h1 style={{
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    lineHeight: 1.2,
                }}>
                    {/* Градиентный акцент как на zachet.app */}
                    <span style={gradientTextStyle}>Buggy Insurance</span>
                </h1>
                <p style={{
                    fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                    color: '#4a5568',
                    marginBottom: '2.5rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    Оформляйте страховку онлайн быстро и удобно
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link
                        to="/products"
                        className="btn" // Убираем btn-primary, будем стилизовать инлайн
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '40px',
                            fontWeight: 600,
                            border: 'none',
                            boxShadow: '0 10px 20px -8px rgba(102, 126, 234, 0.6)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 25px -8px rgba(102, 126, 234, 0.7)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(102, 126, 234, 0.6)';
                        }}
                    >
                        Смотреть продукты
                    </Link>
                    {!user && (
                        <>
                            <Link
                                to="/login"
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    color: '#2d3748',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '40px',
                                    fontWeight: 600,
                                    border: '2px solid #cbd5e0',
                                    transition: 'border-color 0.2s, color 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.color = '#667eea';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e0';
                                    e.currentTarget.style.color = '#2d3748';
                                }}
                            >
                                Войти
                            </Link>
                            <Link
                                to="/register"
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    color: '#2d3748',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '40px',
                                    fontWeight: 600,
                                    border: '2px solid #cbd5e0',
                                    transition: 'border-color 0.2s, color 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#764ba2';
                                    e.currentTarget.style.color = '#764ba2';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e0';
                                    e.currentTarget.style.color = '#2d3748';
                                }}
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* ПРЕИМУЩЕСТВА - стиль карточек как на skinive.com */}
            <section style={{ marginBottom: '5rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem' }}>
                    Наши преимущества
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                }}>
                    {[
                        { icon: '⚡', title: 'Быстро', desc: 'Оформление за 5 минут' },
                        { icon: '🔒', title: 'Безопасно', desc: 'Ваши данные под защитой' },
                        { icon: '💰', title: 'Выгодно', desc: 'Конкурентные цены' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                textAlign: 'center',
                                padding: '2rem 1rem',
                                border: '1px solid #edf2f7',
                                borderRadius: '32px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.02)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.02)';
                            }}
                        >
                            <div style={{
                                fontSize: '2rem',
                                marginBottom: '1rem',
                                background: '#f7fafc',
                                width: '70px',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                margin: '0 auto 1.5rem auto',
                            }}>
                                {item.icon}
                            </div>
                            <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.title}</strong>
                            <p style={{ fontSize: '0.9rem', color: '#718096', margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ТИПЫ СТРАХОВОК - стиль карточек продуктов как на zachet.app */}
            <section>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem' }}>
                    Типы страховок
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {PRODUCT_TYPES.map((p) => (
                        <Link
                            key={p.type}
                            to={`/products/${p.type.toLowerCase()}`}
                            className="card"
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: '1.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '24px',
                                backgroundColor: 'white',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#c3dafe';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            {/* Иконка на круге как в фичах на zachet.app */}
                            <div style={{
                                fontSize: '2rem',
                                marginBottom: '1rem',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '18px', // Чуть скругленный квадрат, как на референсе
                                color: 'white',
                            }}>
                                {p.icon}
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 600 }}>{p.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#718096', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FOOTER - минималистичный как на sptnk.pro */}
            <footer style={{
                marginTop: '5rem',
                padding: '2rem 0',
                textAlign: 'center',
                color: '#a0aec0',
                fontSize: '0.9rem',
                borderTop: '1px solid #e2e8f0',
            }}>
                <p>© Buggy Insurance. Контакты: support@buggy-insurance.ru</p>
            </footer>
        </div>
    );
}