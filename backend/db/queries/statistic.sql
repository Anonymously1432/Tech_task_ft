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
