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

-- name: GetManagerApplications :many
SELECT
    a.id,
    a.status,
    a.calculated_price,
    a.created_at,
    u.id        AS client_id,
    u.full_name AS client_full_name,
    u.email     AS client_email,
    p.type      AS product_type
FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN products p ON a.product_id = p.id
WHERE
    ($1::text IS NULL OR a.status = $1)
  AND ($2::text IS NULL OR p.type = $2)
  AND ($3::timestamp IS NULL OR a.created_at >= $3)
  AND ($4::timestamp IS NULL OR a.created_at <= $4)
  AND ($5::int IS NULL OR u.id = $5)
ORDER BY a.created_at DESC
    LIMIT $6 OFFSET $7;

-- name: GetManagerApplicationsCount :one
SELECT COUNT(*) AS total
FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN products p ON a.product_id = p.id
WHERE
    ($1::text IS NULL OR a.status = $1)
  AND ($2::text IS NULL OR p.type = $2)
  AND ($3::timestamp IS NULL OR a.created_at >= $3)
  AND ($4::timestamp IS NULL OR a.created_at <= $4)
  AND ($5::int IS NULL OR u.id = $5);

-- name: GetManagerApplicationByID :one
SELECT
    a.id,
    a.status,
    a.data,
    a.calculated_price,
    a.created_at,
    p.type AS product_type,
    u.id        AS client_id,
    u.full_name AS client_full_name,
    u.email     AS client_email,
    u.phone     AS client_phone
FROM applications a
         JOIN users u ON a.user_id = u.id
         JOIN products p ON a.product_id = p.id
WHERE a.id = $1;

-- name: GetApplicationComments :many
SELECT
    ac.id,
    ac.comment,
    ac.created_at,
    u.id        AS author_id,
    u.full_name AS author_full_name
FROM application_comments ac
         JOIN users u ON ac.user_id = u.id
WHERE ac.application_id = $1
ORDER BY ac.created_at ASC;

-- name: UpdateApplicationStatus :one
UPDATE applications
SET
    status = $2,
    updated_at = NOW(),
    rejection_reason = $3
WHERE id = $1
    RETURNING id, status, updated_at;

-- name: CreateApplicationComment :exec
INSERT INTO application_comments (
    application_id,
    author_role,
    comment,
    created_at
) VALUES (
    $1,
    'MANAGER',
    $2,
    NOW()
);

-- name: GetUserByID :one
SELECT id, full_name
FROM users
WHERE id = $1;

-- name: CreateApplicationCommentt :one
INSERT INTO application_comments (
    application_id,
    user_id,
    comment,
    created_at
) VALUES (
             $1,
             $2,
             $3,
             NOW()
         )
    RETURNING id, comment, created_at;

-- name: GetApplicationsCountByType :many
SELECT p.type AS product_type, COUNT(*) AS total
FROM applications a
         JOIN products p ON a.product_id = p.id
WHERE a.created_at >= $1
GROUP BY p.type;

-- name: GetApplicationsCountByStatus :many
SELECT status, COUNT(*) AS total
FROM applications
WHERE created_at >= $1
GROUP BY status;

-- name: GetApplicationsConversion :one
SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved,
    COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected
FROM applications
WHERE created_at >= $1;
