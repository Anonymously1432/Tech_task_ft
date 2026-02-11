-- name: GetProducts :many
SELECT id, type, name, description, base_price
FROM products
WHERE is_active = true;