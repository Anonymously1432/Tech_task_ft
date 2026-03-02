import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PRODUCT_TYPES = [
    { type: 'AUTO', name: 'ОСАГО/КАСКО', desc: 'Страхование автомобиля по системам ОСАГО и КАСКО. Покрывает ответственность перед третьими лицами, а также риски повреждения, угона и полной гибели транспортного средства.', icon: '🚗' },
    { type: 'HOME', name: 'Жильё', desc: 'Страхование жилой недвижимости. Предусматривает защиту имущества от пожара, затопления, стихийных бедствий и противоправных действий третьих лиц.', icon: '🏠' },
    { type: 'LIFE', name: 'Жизнь', desc: 'Страхование жизни и здоровья застрахованного лица. Обеспечивает финансовую защиту при наступлении страховых случаев, связанных с утратой трудоспособности или смертью.', icon: '❤️' },
    { type: 'HEALTH', name: 'Здоровье (ДМС)', desc: 'Добровольное медицинское страхование. Включает получение медицинских услуг, диагностику, лечение и госпитализацию в рамках условий договора.', icon: '🏥' },
    { type: 'TRAVEL', name: 'Путешествия', desc:  'Страхование лиц, выезжающих за пределы постоянного места проживания. Покрывает медицинские расходы и иные риски на период поездки.', icon: '✈️' },
];

// Данные для FAQ
const FAQ_ITEMS = [
    { q: 'Как быстро я получу полис?', a: 'Сразу после оплаты. Электронный полис придет на вашу почту в течение 1-2 минут, а также будет доступен в личном кабинете.' },
    { q: 'Какие документы нужны для оформления?', a: 'Для большинства продуктов достаточно паспорта и водительского удостоверения (для авто) или данных свидетельства о регистрации ТС.' },
    { q: 'Можно ли вернуть страховку?', a: 'Да, в период охлаждения (обычно 14 дней) вы можете отказаться от страховки и получить деньги обратно, если не было страховых случаев.' },
    { q: 'Вы работаете с прямыми страховщиками?', a: 'Да, мы являемся официальным партнером ведущих страховых компаний России, таких как АльфаСтрахование, Ингосстрах, РЕСО-Гарантия и других.' },
];

// Данные для футера (имитация широкого меню)
const FOOTER_LINKS = {
    'Продукты': ['ОСАГО', 'КАСКО', 'Страхование жизни', 'ДМС', 'Страхование жилья', 'Туристам'],
    'Помощь': ['Как оформить', 'Вопрос-ответ', 'Страховые случаи', 'Контакты', 'Блог'],
    'О компании': ['О нас', 'Партнеры', 'Реквизиты', 'Вакансии', 'Политика данных'],
};

export default function HomePage() {
    const { user } = useAuth();

    // Базовые стили для градиентного текста
    const gradientTextStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    return (
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}> {/* Убираем все внутренние отступы */}

            {/* HERO СЕКЦИЯ - теперь без верхнего отступа */}
            <section style={{
                textAlign: 'center',
                padding: '5rem 1rem 6rem 1rem',
                marginTop: 0, // Убираем верхний отступ
                marginBottom: '5rem',
                background: 'radial-gradient(circle at 70% 30%, #f0f4ff, #e6ecf8 90%)',
                borderRadius: '0 0 48px 48px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Абстрактные фоновые элементы */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(102, 126, 234, 0.1)', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(118, 75, 162, 0.1)', filter: 'blur(50px)' }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 10vw, 4.5rem)',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }}>
                        <span style={gradientTextStyle}>Buggy Insurance</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                        color: '#2d3748',
                        marginBottom: '3rem',
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontWeight: 400,
                    }}>
                        Ваша защита в один клик. Надежно. Быстро. Честно.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to="/products"
                            className="btn"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '0.9rem 3rem',
                                borderRadius: '50px',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                border: 'none',
                                boxShadow: '0 15px 25px -8px rgba(102, 126, 234, 0.5)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 30px -8px rgba(102, 126, 234, 0.7)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 15px 25px -8px rgba(102, 126, 234, 0.5)';
                            }}
                        >
                            Рассчитать стоимость
                        </Link>
                        {!user && (
                            <Link
                                to="/register"
                                className="btn"
                                style={{
                                    background: 'white',
                                    color: '#2d3748',
                                    padding: '0.9rem 2.5rem',
                                    borderRadius: '50px',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    border: '1px solid #cbd5e0',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                    transition: 'border-color 0.2s, transform 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e0';
                                    e.currentTarget.style.transform = '';
                                }}
                            >
                                Создать аккаунт
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Остальные секции без изменений */}
            {/* ПРЕИМУЩЕСТВА */}
            <section style={{ marginBottom: '6rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Почему выбирают нас
                </h2>
                <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Мы делаем страхование простым и доступным, чтобы вы могли сосредоточиться на главном.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    {[
                        { icon: '⚡', title: 'Мгновенное оформление', desc: 'Без визитов в офис и очередей. Заполните заявку за 5 минут и сразу получите полис.' },
                        { icon: '🤖', title: 'ИИ-помощник 24/7', desc: 'Умный алгоритм подберет лучшую страховку под ваш профиль и ответит на вопросы в любое время.' },
                        { icon: '💰', title: 'Экономия до 30%', desc: 'Сравниваем цены всех ведущих страховых компаний и предлагаем самые выгодные условия.' },
                        { icon: '🔒', title: 'Гарантия конфиденциальности', desc: 'Ваши данные надежно защищены современными технологиями шифрования.' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="card"
                            style={{
                                textAlign: 'center',
                                padding: '2.5rem 1.5rem',
                                border: '1px solid #edf2f7',
                                borderRadius: '32px',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'white',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(102,126,234,0.3)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)';
                                e.currentTarget.style.borderColor = '#edf2f7';
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '1.5rem',
                                background: 'linear-gradient(135deg, #e9efff, #f0e7ff)',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '24px',
                                margin: '0 auto 1.5rem auto',
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.8rem' }}>{item.title}</h3>
                            <p style={{ fontSize: '1rem', color: '#718096', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ТИПЫ СТРАХОВОК */}
            <section style={{ marginBottom: '6rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Виды страхования
                </h2>
                <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Выберите то, что нужно защитить прямо сейчас.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.8rem',
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
                                padding: '2rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '32px',
                                backgroundColor: 'white',
                                boxShadow: '0 8px 20px -6px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#c3dafe';
                                e.currentTarget.style.boxShadow = '0 25px 30px -12px rgba(102,126,234,0.25)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={{
                                fontSize: '2.2rem',
                                marginBottom: '1.2rem',
                                background: 'linear-gradient(135deg, #667eea20, #764ba220)',
                                width: '70px',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '20px',
                                color: '#4a5568',
                            }}>
                                {p.icon}
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 600 }}>{p.name}</h3>
                            <p style={{ fontSize: '1rem', color: '#718096', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section style={{ marginBottom: '6rem', background: '#f9fafc', padding: '4rem 2rem', borderRadius: '48px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Часто задаваемые вопросы
                </h2>
                <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Ответы на самые популярные вопросы о наших услугах.
                </p>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {FAQ_ITEMS.map((item, index) => (
                        <details key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
                            <summary style={{ fontWeight: 600, fontSize: '1.15rem', cursor: 'pointer', color: '#2d3748', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {item.q}
                                <span style={{ fontSize: '1.5rem', color: '#667eea' }}>+</span>
                            </summary>
                            <p style={{ marginTop: '1rem', color: '#4a5568', paddingRight: '2rem' }}>{item.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* CTA БЛОК */}
            <section style={{
                marginBottom: '6rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '4rem 2rem',
                borderRadius: '48px',
                textAlign: 'center',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Готовы начать?</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Присоединяйтесь к 1 млн+ пользователей, которые уже защищены</p>
                <Link
                    to="/products"
                    className="btn"
                    style={{
                        background: 'white',
                        color: '#667eea',
                        padding: '1rem 3rem',
                        borderRadius: '50px',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        border: 'none',
                        boxShadow: '0 15px 25px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Оформить страховку
                </Link>
            </section>

            {/* ШИРОКИЙ ФУТЕР */}
            <footer style={{
                marginTop: 0, // Убираем верхний отступ
                padding: '4rem 0 2rem 0',
                backgroundColor: '#0b0f18',
                color: '#a0aec0',
                borderTopLeftRadius: '48px',
                borderTopRightRadius: '48px',
                marginLeft: '-1rem',
                marginRight: '-1rem',
                paddingLeft: 'calc(1rem + 15px)',
                paddingRight: 'calc(1rem + 15px)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}>
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Buggy Insurance</h4>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>Современный сервис страхования, который экономит ваше время и деньги. Мы рядом 24/7.</p>
                    </div>
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.2rem', fontWeight: 600 }}>{category}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {links.map(link => (
                                    <li key={link} style={{ marginBottom: '0.7rem' }}>
                                        <a href="#" style={{ color: '#a0aec0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                           onMouseOver={(e) => e.currentTarget.style.color = '#cbd5e0'}
                                           onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Нижняя часть футера */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    paddingTop: '2rem',
                    borderTop: '1px solid #1f2937',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>© 2024 Buggy Insurance. Все права защищены.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span style={{ fontSize: '1.2rem', cursor: 'default' }}>📱</span>
                        <span style={{ fontSize: '1.2rem', cursor: 'default' }}>📘</span>
                        <span style={{ fontSize: '1.2rem', cursor: 'default' }}>📷</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}