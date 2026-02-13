-- name: CreateUser :one
INSERT INTO users (email, password_hash, full_name, phone, birth_date)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, email, full_name;

-- name: GetByEmail :one
SELECT id, email, role, password_hash
FROM users
WHERE email = $1;

-- name: CreateToken :exec
INSERT INTO refresh_tokens (user_id, token, expires_at)
VALUES ($1, $2, $3);

-- name: DeleteToken :exec
UPDATE refresh_tokens
SET deleted_at = NOW()
WHERE token = $1;

-- name: GetByID :one
SELECT email, full_name, phone, birth_date, address, role
FROM users
WHERE id = $1;

-- name: UpdateUser :one
UPDATE users
SET (full_name, email, address) = ($2, $3, $4)
WHERE id = $1
RETURNING email, full_name, phone, birth_date, address, role;

-- name: CountUserPolicies :one
SELECT COUNT(*) AS total
FROM policies
WHERE user_id = $1 AND status = $2;

-- name: SumUserPoliciesCoverage :one
SELECT COALESCE(SUM(coverage_amount),0) AS total
FROM policies
WHERE user_id = $1 AND status = $2;

-- name: CountUserApplications :one
SELECT COUNT(*) AS total
FROM applications
WHERE user_id = $1 AND status = $2;

-- name: GetRecentUserActivity :many
SELECT a.id, 'application' AS type, a.status, a.created_at, p.type AS product_type, a.calculated_price
FROM applications a
         JOIN products p ON a.product_id = p.id
WHERE a.user_id = $1
UNION ALL
SELECT p.id, 'policy' AS type, p.status, p.created_at, pr.type AS product_type, NULL AS calculated_price
FROM policies p
         JOIN products pr ON p.product_id = pr.id
WHERE p.user_id = $1
ORDER BY created_at DESC
    LIMIT $2;
