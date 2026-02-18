BEGIN;

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'client', -- 'client' | 'manager' | 'admin'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Refresh токены
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Продукты (типы страховок)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) UNIQUE NOT NULL, -- 'AUTO', 'HOME', 'LIFE', 'HEALTH', 'TRAVEL'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Заявки на страховку
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    status VARCHAR(20) NOT NULL DEFAULT 'NEW', -- 'NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'
    data JSONB NOT NULL, -- специфичные для типа поля
    calculated_price DECIMAL(10, 2),
    manager_id INTEGER REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- История изменения статусов
CREATE TABLE application_status_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Полисы (после одобрения заявки)
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    application_id INTEGER REFERENCES applications(id),
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    coverage_amount DECIMAL(12, 2) NOT NULL,
    premium DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Платежи
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id),
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Комментарии менеджеров к заявкам
CREATE TABLE application_comments (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_policies_user_id ON policies(user_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_payments_policy_id ON payments(policy_id);

COMMIT;