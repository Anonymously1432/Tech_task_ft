-- name: CreateApplication :one
INSERT INTO applications(user_id, product_id, data, calculated_price, manager_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, status, calculated_price, created_at;