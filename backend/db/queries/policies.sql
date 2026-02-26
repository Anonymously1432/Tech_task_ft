-- name: GetPolicies :many
SELECT
    p.id,
    p.policy_number,
    pr.type AS product_type,
    p.status,
    p.start_date,
    p.end_date,
    p.coverage_amount,
    p.premium
FROM policies p
         JOIN products pr ON p.product_id = pr.id
WHERE p.user_id = $1
  AND ($2::text IS NULL OR p.status = $2)
ORDER BY p.created_at DESC
    LIMIT $3 OFFSET $4;

-- name: GetAllPolicies :many
SELECT
    p.id,
    p.policy_number,
    pr.type AS product_type,
    p.status,
    p.start_date,
    p.end_date,
    p.coverage_amount,
    p.premium
FROM policies p
         JOIN products pr ON p.product_id = pr.id
WHERE p.user_id = $1
ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3;

-- name: GetPoliciesCount :one
SELECT COUNT(*) AS total
FROM policies
WHERE user_id = $1
  AND ($2::text IS NULL OR status = $2);
