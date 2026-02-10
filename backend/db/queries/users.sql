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