BEGIN;

-- Отключаем ограничения для создания багов
ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE applications ALTER COLUMN data DROP NOT NULL;
ALTER TABLE policies ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE policies ALTER COLUMN end_date DROP NOT NULL;
ALTER TABLE policies ALTER COLUMN coverage_amount DROP NOT NULL;
ALTER TABLE application_status_history DROP CONSTRAINT IF EXISTS application_status_history_application_id_fkey;

-- =====================================================
-- 1. Продукты (как в ТЗ раздел 7.2)
-- =====================================================
INSERT INTO products (type, name, base_price, description, is_active) VALUES
                                                                          ('AUTO', 'ОСАГО/КАСКО', 5000, 'Страхование автомобиля', true),
                                                                          ('HOME', 'Жильё', 3000, 'Страхование квартиры или дома', true),
                                                                          ('LIFE', 'Жизнь', 10000, 'Страхование жизни', true),
                                                                          ('HEALTH', 'Здоровье (ДМС)', 15000, 'Добровольное медицинское страхование', true),
                                                                          ('TRAVEL', 'Путешествия', 1500, 'Страхование выезжающих за рубеж', true);

-- =====================================================
-- 2. Пользователи (как в ТЗ раздел 7.1)
-- =====================================================
INSERT INTO users (email, password_hash, full_name, phone, birth_date, address, role, is_active, created_at, updated_at) VALUES
                                                                                                                             -- Обычные клиенты
                                                                                                                             ('client1@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Иванов Иван Иванович', '+79001234567', '1990-05-15', 'г. Москва, ул. Ленина, д. 1, кв. 50', 'client', true, NOW(), NOW()),
                                                                                                                             ('client2@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Петрова Мария Сергеевна', '+79009876543', '1985-08-22', 'г. Москва, ул. Пушкина, д. 10, кв. 100', 'client', true, NOW(), NOW()),
                                                                                                                             ('client3@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Сидоров Алексей Павлович', '+79005554433', '1995-03-10', 'г. Москва, ул. Тверская, д. 5, кв. 25', 'client', true, NOW(), NOW()),

                                                                                                                             -- Заблокированный клиент
                                                                                                                             ('blocked@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Козлов Дмитрий', '+79001112233', '1980-12-01', 'г. Москва, ул. Арбат, д. 15, кв. 7', 'client', false, NOW(), NOW()),

                                                                                                                             -- Менеджеры
                                                                                                                             ('manager1@test.com', '$2a$15$VFT6K5lSePQ94VaiwioQG.J8ecG.RL6QTfW0D5BsnWcrtU5B0FYey', 'Менеджер Мария Ивановна', '+79007778899', '1988-07-18', NULL, 'manager', true, NOW(), NOW()),
                                                                                                                             ('manager2@test.com', '$2a$15$VFT6K5lSePQ94VaiwioQG.J8ecG.RL6QTfW0D5BsnWcrtU5B0FYey', 'Менеджер Пётр Николаевич', '+79006665544', '1992-11-25', NULL, 'manager', true, NOW(), NOW()),

                                                                                                                             -- Баг #16: NULL в обязательном поле full_name
                                                                                                                             ('broken@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', NULL, '+79003332211', '1991-09-09', 'г. Москва, ул. Ошибок, д. 99', 'client', true, NOW(), NOW()),

                                                                                                                             -- Баг #15: дубликаты email
                                                                                                                             ('duplicate@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Дубликат Первый', '+79004445566', '1987-04-04', 'г. Москва, ул. Повторов, д. 1', 'client', true, NOW(), NOW()),
                                                                                                                             ('duplicate@test.com', '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.', 'Дубликат Второй', '+79004445567', '1987-04-04', 'г. Москва, ул. Повторов, д. 2', 'client', true, NOW(), NOW());

-- =====================================================
-- 3. Заявки (как в ТЗ раздел 7.3)
-- =====================================================
INSERT INTO applications (user_id, product_id, status, data, calculated_price, manager_id, rejection_reason, created_at, updated_at) VALUES
                                                                                                                                         -- Заявка: AUTO, одобрена (клиент 1)
                                                                                                                                         (1, 1, 'APPROVED', '{
        "brand": "Toyota",
        "model": "Camry",
        "year": 2020,
        "vin": "JTDKN3DU5A0123456",
        "plateNumber": "А123БВ777",
        "insuranceType": "KASKO",
        "drivingExperience": 5
    }', 45000, 6, NULL, '2026-01-15 10:30:00', '2026-01-16 14:20:00'),

                                                                                                                                         -- Заявка: HOME, новая (клиент 1)
                                                                                                                                         (1, 2, 'NEW', '{
        "propertyType": "apartment",
        "address": "г. Москва, ул. Ленина, д. 1, кв. 50",
        "area": 65,
        "floor": 5,
        "buildYear": 2015,
        "coverageAmount": 5000000
    }', 18000, NULL, NULL, '2026-01-25 09:15:00', '2026-01-25 09:15:00'),

                                                                                                                                         -- Заявка: LIFE, на рассмотрении (клиент 2)
                                                                                                                                         (2, 3, 'UNDER_REVIEW', '{
        "age": 35,
        "gender": "female",
        "smoking": false,
        "chronicDiseases": false,
        "coverageAmount": 3000000,
        "term": 5
    }', 35000, 5, NULL, '2026-01-20 11:40:00', '2026-01-21 10:30:00'),

                                                                                                                                         -- Заявка: TRAVEL, отклонена (клиент 2)
                                                                                                                                         (2, 5, 'REJECTED', '{
        "country": "Thailand",
        "startDate": "2026-02-01",
        "endDate": "2026-02-10",
        "travelers": 1,
        "activeLeisure": false,
        "coverageAmount": 30000
    }', 5000, 5, 'Недостаточно документов, не указан загранпаспорт', '2026-01-18 16:20:00', '2026-01-19 09:45:00'),

                                                                                                                                         -- Заявка: HEALTH, одобрена (клиент 1)
                                                                                                                                         (1, 4, 'APPROVED', '{
        "age": 35,
        "program": "PREMIUM",
        "dentistry": true,
        "hospitalization": true,
        "chronicConditions": "none"
    }', 55000, 6, NULL, '2026-01-10 14:30:00', '2026-01-12 11:20:00'),

                                                                                                                                         -- Заявка: AUTO, новая (клиент 2) - для тестирования IDOR
                                                                                                                                         (2, 1, 'NEW', '{
        "brand": "BMW",
        "model": "X5",
        "year": 2022,
        "vin": "WBA12345678901234",
        "plateNumber": "В456ЕМ777",
        "insuranceType": "OSAGO",
        "drivingExperience": 8
    }', 25000, NULL, NULL, '2026-01-26 10:30:00', '2026-01-26 10:30:00'),

                                                                                                                                         -- Дополнительные заявки для статистики
                                                                                                                                         (2, 1, 'APPROVED', '{"brand": "Honda", "model": "CR-V", "year": 2021, "vin": "HON1234567890", "plateNumber": "К789ОР777", "insuranceType": "KASKO", "drivingExperience": 10}', 48000, 5, NULL, '2026-01-05 08:00:00', '2026-01-07 12:00:00'),
                                                                                                                                         (3, 2, 'REJECTED', '{"propertyType": "house", "address": "МО, пос. Загородный, д. 15", "area": 120, "buildYear": 2010, "coverageAmount": 8000000}', 25000, 6, 'Площадь не соответствует документам', '2026-01-08 13:00:00', '2026-01-09 15:30:00'),
                                                                                                                                         (1, 5, 'APPROVED', '{"country": "Egypt", "startDate": "2026-03-01", "endDate": "2026-03-07", "travelers": 2, "activeLeisure": true, "coverageAmount": 50000}', 8500, 5, NULL, '2026-01-22 12:00:00', '2026-01-23 09:00:00'),
                                                                                                                                         (2, 3, 'APPROVED', '{"age": 40, "gender": "female", "smoking": false, "chronicDiseases": true, "coverageAmount": 5000000, "term": 10}', 42000, 6, NULL, '2026-01-12 15:00:00', '2026-01-14 10:00:00'),

                                                                                                                                         -- Дополнительные заявки для наполнения
                                                                                                                                         (3, 1, 'NEW', '{"brand": "Kia", "model": "Rio", "year": 2023, "vin": "KIA123456789", "plateNumber": "Е321КХ777", "insuranceType": "OSAGO", "drivingExperience": 2}', 15000, NULL, NULL, '2026-01-28 09:00:00', '2026-01-28 09:00:00'),
                                                                                                                                         (4, 2, 'NEW', '{"propertyType": "apartment", "address": "г. Москва, ул. Новая, д. 5", "area": 45, "floor": 3, "buildYear": 2020, "coverageAmount": 3000000}', 12000, NULL, NULL, '2026-01-27 14:30:00', '2026-01-27 14:30:00'),
                                                                                                                                         (1, 3, 'UNDER_REVIEW', '{"age": 45, "gender": "male", "smoking": true, "chronicDiseases": false, "coverageAmount": 4000000, "term": 5}', 38000, 5, NULL, '2026-01-26 11:20:00', '2026-01-27 10:15:00'),
                                                                                                                                         (2, 4, 'NEW', '{"age": 28, "program": "BASIC", "dentistry": false, "hospitalization": true, "chronicConditions": "none"}', 25000, NULL, NULL, '2026-01-29 16:45:00', '2026-01-29 16:45:00'),
                                                                                                                                         (3, 5, 'NEW', '{"country": "Turkey", "startDate": "2026-06-01", "endDate": "2026-06-10", "travelers": 2, "activeLeisure": false, "coverageAmount": 30000}', 4500, NULL, NULL, '2026-01-30 12:00:00', '2026-01-30 12:00:00');

-- =====================================================
-- 4. Полисы (как в ТЗ раздел 7.4)
-- =====================================================
INSERT INTO policies (policy_number, application_id, user_id, product_id, status, start_date, end_date, coverage_amount, premium, created_at) VALUES
                                                                                                                                                  ('INS-2026-00001', 1, 1, 1, 'ACTIVE', '2026-01-16', '2027-01-16', 2000000, 45000, '2026-01-16 14:20:00'),
                                                                                                                                                  ('INS-2026-00002', NULL, 2, 2, 'ACTIVE', '2026-01-01', '2027-01-01', 5000000, 18000, '2026-01-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00003', NULL, 2, 3, 'ACTIVE', '2026-01-01', '2027-01-01', 3000000, 35000, '2026-01-01 10:00:00'),
                                                                                                                                                  ('INS-2025-00010', NULL, 1, 5, 'EXPIRED', '2025-01-01', '2026-01-01', 50000, 5000, '2025-01-01 09:00:00'),

                                                                                                                                                  -- Баг #13: Полис с несоответствием платежей
                                                                                                                                                  ('INS-2026-00005', 5, 2, 4, 'ACTIVE', '2026-01-12', '2027-01-12', 2000000, 45000, '2026-01-12 11:20:00'),

                                                                                                                                                  -- Дополнительные полисы
                                                                                                                                                  ('INS-2026-00006', NULL, 1, 2, 'ACTIVE', '2026-02-01', '2027-02-01', 1500000, 15000, '2026-02-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00007', NULL, 1, 3, 'ACTIVE', '2026-02-01', '2027-02-01', 2000000, 30000, '2026-02-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00008', NULL, 2, 1, 'ACTIVE', '2026-02-01', '2027-02-01', 1800000, 42000, '2026-02-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00009', NULL, 3, 5, 'ACTIVE', '2026-02-01', '2027-02-01', 100000, 8000, '2026-02-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00010', NULL, 3, 4, 'ACTIVE', '2026-02-01', '2027-02-01', 3000000, 52000, '2026-02-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00011', NULL, 4, 1, 'EXPIRED', '2025-06-01', '2026-06-01', 1500000, 40000, '2025-06-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00012', NULL, 4, 2, 'ACTIVE', '2026-01-15', '2027-01-15', 2000000, 16000, '2026-01-15 10:00:00'),
                                                                                                                                                  ('INS-2026-00013', 5, 1, 4, 'ACTIVE', '2026-01-12', '2027-01-12', 3000000, 55000, '2026-01-12 11:20:00'),
                                                                                                                                                  ('INS-2026-00014', NULL, 2, 5, 'ACTIVE', '2026-03-01', '2026-03-15', 50000, 7500, '2026-03-01 10:00:00'),
                                                                                                                                                  ('INS-2026-00015', NULL, 3, 1, 'ACTIVE', '2026-02-15', '2027-02-15', 2000000, 23000, '2026-02-15 10:00:00');

-- =====================================================
-- 5. Платежи (как в ТЗ раздел 7.5) - Баг #13
-- =====================================================
INSERT INTO payments (policy_id, user_id, amount, status, payment_method, transaction_id, created_at) VALUES
                                                                                                          -- Для полиса INS-2026-00005 (премия 45000): COMPLETED 20000 + 20000 = 40000 (не хватает 5000)
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00005'), 2, 20000, 'COMPLETED', 'BANK_CARD', 'txn_1001', '2026-01-12 12:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00005'), 2, 20000, 'COMPLETED', 'BANK_CARD', 'txn_1002', '2026-01-12 12:05:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00005'), 2, 5000, 'PENDING', 'BANK_CARD', 'txn_1003', '2026-01-20 10:00:00'),

                                                                                                          -- Нормальные платежи для других полисов
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00001'), 1, 45000, 'COMPLETED', 'BANK_CARD', 'txn_0001', '2026-01-16 15:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00002'), 2, 18000, 'COMPLETED', 'BANK_CARD', 'txn_0002', '2026-01-01 11:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00003'), 2, 35000, 'COMPLETED', 'BANK_CARD', 'txn_0003', '2026-01-01 11:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2025-00010'), 1, 5000, 'COMPLETED', 'BANK_CARD', 'txn_0004', '2025-01-01 10:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00006'), 1, 15000, 'COMPLETED', 'BANK_CARD', 'txn_0005', '2026-02-01 11:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00007'), 1, 30000, 'COMPLETED', 'BANK_CARD', 'txn_0006', '2026-02-01 11:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00008'), 2, 42000, 'COMPLETED', 'BANK_CARD', 'txn_0007', '2026-02-01 11:00:00'),
                                                                                                          ((SELECT id FROM policies WHERE policy_number = 'INS-2026-00009'), 3, 8000, 'COMPLETED', 'BANK_CARD', 'txn_0008', '2026-02-01 11:00:00');

-- =====================================================
-- 6. История статусов (как в ТЗ раздел 7.6) - Баг #14
-- =====================================================
INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, comment, created_at) VALUES
                                                                                                                     -- Для заявки 1 (APPROVED)
                                                                                                                     (1, NULL, 'NEW', 1, 'Создание заявки', '2026-01-15 10:30:00'),
                                                                                                                     (1, 'NEW', 'UNDER_REVIEW', 5, 'Взято в работу', '2026-01-16 09:00:00'),
                                                                                                                     (1, 'UNDER_REVIEW', 'APPROVED', 5, 'Одобрено', '2026-01-16 14:20:00'),

                                                                                                                     -- Для заявки 3 (UNDER_REVIEW)
                                                                                                                     (3, NULL, 'NEW', 2, 'Создание заявки', '2026-01-20 11:40:00'),
                                                                                                                     (3, 'NEW', 'UNDER_REVIEW', 5, 'Взято в работу', '2026-01-21 10:30:00'),

                                                                                                                     -- Для заявки 4 (REJECTED)
                                                                                                                     (4, NULL, 'NEW', 2, 'Создание заявки', '2026-01-18 16:20:00'),
                                                                                                                     (4, 'NEW', 'UNDER_REVIEW', 5, 'Взято в работу', '2026-01-19 09:00:00'),
                                                                                                                     (4, 'UNDER_REVIEW', 'REJECTED', 5, 'Отклонено: недостаточно документов', '2026-01-19 09:45:00'),

                                                                                                                     -- Для заявки 5 (APPROVED)
                                                                                                                     (5, NULL, 'NEW', 1, 'Создание заявки', '2026-01-10 14:30:00'),
                                                                                                                     (5, 'NEW', 'UNDER_REVIEW', 6, 'Взято в работу', '2026-01-11 10:00:00'),
                                                                                                                     (5, 'UNDER_REVIEW', 'APPROVED', 6, 'Одобрено', '2026-01-12 11:20:00'),

                                                                                                                     -- Нормальные записи для других заявок
                                                                                                                     (6, NULL, 'NEW', 2, 'Создание заявки', '2026-01-05 08:00:00'),
                                                                                                                     (6, 'NEW', 'APPROVED', 5, 'Одобрено', '2026-01-07 12:00:00'),
                                                                                                                     (7, NULL, 'NEW', 3, 'Создание заявки', '2026-01-08 13:00:00'),
                                                                                                                     (7, 'NEW', 'REJECTED', 6, 'Отклонено', '2026-01-09 15:30:00'),
                                                                                                                     (8, NULL, 'NEW', 1, 'Создание заявки', '2026-01-22 12:00:00'),
                                                                                                                     (8, 'NEW', 'APPROVED', 5, 'Одобрено', '2026-01-23 09:00:00'),
                                                                                                                     (9, NULL, 'NEW', 2, 'Создание заявки', '2026-01-12 15:00:00'),
                                                                                                                     (9, 'NEW', 'APPROVED', 6, 'Одобрено', '2026-01-14 10:00:00'),

-- =====================================================
-- БАГ #14: Orphan-записи (application_id не существует)
-- Вставляем с заведомо несуществующим ID
-- =====================================================
                                                                                                                     (999999, 'NEW', 'UNDER_REVIEW', 5, 'Тестовый orphan', '2026-01-01 10:00:00'),
                                                                                                                     (999999, 'UNDER_REVIEW', 'REJECTED', 5, 'Ещё один orphan', '2026-01-02 11:00:00');

-- =====================================================
-- 7. Комментарии менеджеров
-- =====================================================
INSERT INTO application_comments (application_id, user_id, comment, created_at) VALUES
                                                                                    (1, 5, 'Проверить документы на автомобиль', '2026-01-16 09:00:00'),
                                                                                    (1, 5, 'Документы в порядке, можно одобрять', '2026-01-16 14:00:00'),
                                                                                    (3, 5, 'Запросить справку о состоянии здоровья', '2026-01-21 11:00:00'),
                                                                                    (4, 5, 'Клиенту нужно прислать копию загранпаспорта', '2026-01-19 09:30:00'),
                                                                                    (5, 6, 'Премиум-пакет, проверить возраст', '2026-01-11 10:05:00'),
                                                                                    (6, 5, 'Хорошая история', '2026-01-06 14:00:00'),
                                                                                    (7, 6, 'Площадь не соответствует документам', '2026-01-09 10:00:00'),
                                                                                    (8, 5, 'Одобрено', '2026-01-23 08:30:00'),
                                                                                    (9, 6, 'Все хорошо', '2026-01-13 16:00:00');

-- =====================================================
-- 8. Refresh токены
-- =====================================================
INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES
                                                                        (1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ikl2YW4gSXZhbm92IiwiaWF0IjoxNzM3ODQwMDAwLCJleHAiOjE3Mzg0NDQ4MDB9', NOW() + INTERVAL '7 days', NOW()),
                                                                        (2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6Ik1hcmlhIFBldHJvdmEiLCJpYXQiOjE3Mzc4NDAwMDAsImV4cCI6MTczODQ0NDgwMH0', NOW() + INTERVAL '7 days', NOW()),
                                                                        (5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwibmFtZSI6Ik1hbmFnZXIgTWFyaWEiLCJpYXQiOjE3Mzc4NDAwMDAsImV4cCI6MTczODQ0NDgwMH0', NOW() + INTERVAL '7 days', NOW());

COMMIT;

-- =====================================================
-- Проверочные запросы (раскомментировать при необходимости)
-- =====================================================
/*
-- Баг #15: Дубликаты email
SELECT email, COUNT(*), array_agg(id) as user_ids
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Баг #16: NULL в обязательных полях
SELECT id, email, full_name, role
FROM users
WHERE full_name IS NULL OR full_name = '';

-- Баг #13: Несоответствие платежей
SELECT p.id, p.policy_number, p.premium,
       COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'COMPLETED'), 0) as paid,
       p.premium - COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'COMPLETED'), 0) as diff
FROM policies p
LEFT JOIN payments pay ON p.id = pay.policy_id
GROUP BY p.id
HAVING p.premium != COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'COMPLETED'), 0);

-- Баг #14: Orphan-записи
SELECT ash.*
FROM application_status_history ash
LEFT JOIN applications a ON ash.application_id = a.id
WHERE a.id IS NULL;
*/