-- name: CreateApplication :one
INSERT INTO applications(user_id, product_id, data, calculated_price, manager_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, status, calculated_price, created_at;

-- name: GetApplications :many
SELECT
    a.id,
    a.status,
    a.calculated_price,
    a.created_at,
    p.type AS product_type
FROM applications a
         JOIN products p ON a.product_id = p.id
WHERE a.user_id = $1
  AND ($2::text IS NULL OR a.status = $2)
ORDER BY a.created_at DESC
    LIMIT $3 OFFSET $4;

-- name: GetApplicationsCount :one
SELECT COUNT(*) AS total
FROM applications
WHERE user_id = $1
  AND ($2::text IS NULL OR status = $2);

-- name: GetApplicationByID :one
SELECT
    a.id,
    a.status,
    a.data,
    a.calculated_price,
    a.created_at,
    p.type AS product_type
FROM applications a
         JOIN products p ON a.product_id = p.id
WHERE a.id = $1;

-- name: GetApplicationStatusHistory :many
SELECT
    old_status,
    new_status,
    changed_by,
    comment,
    created_at
FROM application_status_history
WHERE application_id = $1
ORDER BY created_at ASC;
