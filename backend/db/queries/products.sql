-- name: GetProducts :many
SELECT id, type, name, description, base_price
FROM products
WHERE is_active = true;

-- name: GetProductWithType :many
SELECT id, type, name, description, base_price
FROM products
WHERE type = $1 AND is_active = true;