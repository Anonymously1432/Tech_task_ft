BEGIN;

ALTER TABLE users
ALTER COLUMN full_name DROP NOT NULL;

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_email_key;

ALTER TABLE applications
ALTER COLUMN data DROP NOT NULL;

ALTER TABLE policies
ALTER COLUMN start_date DROP NOT NULL;

ALTER TABLE policies
ALTER COLUMN end_date DROP NOT NULL;

ALTER TABLE policies
ALTER COLUMN coverage_amount DROP NOT NULL;

ALTER TABLE application_status_history
DROP CONSTRAINT IF EXISTS application_status_history_application_id_fkey;

INSERT INTO products (id, type, name, base_price) VALUES
    (1, 'AUTO',   'ОСАГО/КАСКО', 5000),
    (2, 'HOME',   'Жильё',       3000),
    (3, 'LIFE',   'Жизнь',       10000),
    (4, 'HEALTH', 'Здоровье (ДМС)', 15000),
    (5, 'TRAVEL', 'Путешествия', 1500);

INSERT INTO users (id, email, password_hash, role, full_name, is_active) VALUES
    (1,   'client1@test.com',    '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Иванов Иван Иванович', true),
    (2,   'client2@test.com',    '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Петрова Мария Сергеевна', true),
    (3,   'client3@test.com',    '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Сидоров Алексей Павлович', true),
    (4,   'blocked@test.com',    '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Козлов Дмитрий', false),
    (10,  'manager1@test.com',   '$2a$15$SezWJOiCJZthHr4ppMXil.c5A2BHerQPgRDsrOZFgkIszqmhZuY6i',  'manager', 'Менеджер Мария Ивановна', true),
    (11,  'manager2@test.com',   '$2a$15$SezWJOiCJZthHr4ppMXil.c5A2BHerQPgRDsrOZFgkIszqmhZuY6i',  'manager', 'Менеджер Пётр Николаевич', true),
-- Баг #16: NULL в обязательном поле
    (99,  'broken@test.com',     '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  NULL, true),
-- Баг #15: дубликаты email
    (100, 'duplicate@test.com',  '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Дубликат Первый', true),
    (101, 'duplicate@test.com',  '$2a$15$cqi2kc3qAvdl7FkIajhIDOvEa8Q1cmBXNPAFvy/IMS7eeXqo4NhB.',     'client',  'Дубликат Второй', true);

INSERT INTO applications (id, user_id, product_id, status, calculated_price) VALUES
    (1, 1, 1, 'APPROVED', 45000),
    (2, 1, 2, 'NEW', 18000),
    (3, 2, 3, 'UNDER_REVIEW', 35000),
    (4, 2, 5, 'REJECTED', 5000),
    (5, 1, 4, 'APPROVED', 55000),
    (6, 3, 1, 'NEW', 25000),
    (7, 3, 2, 'NEW', 12000),
    (8, 3, 3, 'REJECTED', 30000),
    (9, 4, 1, 'UNDER_REVIEW', 40000),
    (10, 4, 5, 'NEW', 6000),
    (11,1,1,'NEW',20000),(12,1,2,'NEW',15000),(13,1,3,'NEW',30000),(14,1,4,'NEW',50000),(15,1,5,'NEW',7000),
    (16,2,1,'APPROVED',45000),(17,2,2,'APPROVED',18000),(18,2,3,'APPROVED',35000),(19,2,4,'REJECTED',55000),(20,2,5,'NEW',8000),
    (21,3,1,'NEW',22000),(22,3,2,'NEW',14000),(23,3,3,'UNDER_REVIEW',33000),(24,3,4,'NEW',51000),(25,3,5,'NEW',7500),
    (26,4,1,'REJECTED',42000),(27,4,2,'NEW',16000),(28,4,3,'NEW',34000),(29,4,4,'UNDER_REVIEW',56000),(30,4,5,'NEW',8200),
    (31,1,1,'NEW',23000),(32,1,2,'NEW',17000),(33,1,3,'NEW',36000),(34,1,4,'NEW',57000),(35,1,5,'NEW',9000),
    (36,2,1,'NEW',24000),(37,2,2,'NEW',17500),(38,2,3,'NEW',37000),(39,2,4,'NEW',58000),(40,2,5,'NEW',9200),
    (41,3,1,'NEW',25000),(42,2,1,'NEW',45000), -- IDOR
    (43,3,2,'NEW',18000),(44,3,3,'NEW',38000),(45,3,4,'NEW',59000),
    (46,4,1,'NEW',26000),(47,4,2,'NEW',18500),(48,4,3,'NEW',39000),(49,4,4,'NEW',60000),(50,4,5,'NEW',9500);

INSERT INTO policies (id, policy_number, user_id, product_id, status, premium) VALUES
    (1, 'INS-2026-00001', 1, 1, 'ACTIVE', 45000),
    (2, 'INS-2026-00002', 2, 2, 'ACTIVE', 18000),
    (3, 'INS-2026-00003', 2, 3, 'ACTIVE', 35000),
    (4, 'INS-2025-00010', 1, 5, 'EXPIRED', 5000),

-- Баг #13
    (5, 'INS-2026-00005', 2, 4, 'ACTIVE', 45000),

    (6,'INS-2026-00006',1,2,'ACTIVE',15000),
    (7,'INS-2026-00007',1,3,'ACTIVE',30000),
    (8,'INS-2026-00008',2,1,'ACTIVE',42000),
    (9,'INS-2026-00009',3,5,'ACTIVE',8000),
    (10,'INS-2026-00010',3,4,'ACTIVE',52000),
    (11,'INS-2026-00011',4,1,'EXPIRED',40000),
    (12,'INS-2026-00012',4,2,'ACTIVE',16000),
    (13,'INS-2026-00013',1,4,'ACTIVE',55000),
    (14,'INS-2026-00014',2,5,'ACTIVE',7500),
    (15,'INS-2026-00015',3,1,'ACTIVE',23000),
    (16,'INS-2026-00016',3,2,'ACTIVE',14000),
    (17,'INS-2026-00017',4,3,'ACTIVE',34000),
    (18,'INS-2026-00018',1,5,'ACTIVE',7000),
    (19,'INS-2026-00019',2,4,'ACTIVE',56000),
    (20,'INS-2026-00020',4,5,'ACTIVE',8200);

INSERT INTO payments (id, policy_id, amount, status) VALUES
    (1, 5, 20000, 'COMPLETED'),
    (2, 5, 20000, 'COMPLETED'),
    (3, 5, 5000,  'PENDING');

INSERT INTO application_status_history (id, application_id, old_status, new_status) VALUES
    (1,   1, NULL, 'NEW'),
    (2,   1, 'NEW', 'APPROVED'),

-- Orphan-записи
    (100, 999, 'NEW', 'UNDER_REVIEW'),
    (101, 999, 'UNDER_REVIEW', 'REJECTED');

COMMIT;
