BEGIN;

DROP INDEX IF EXISTS idx_payments_policy_id;
DROP INDEX IF EXISTS idx_policies_status;
DROP INDEX IF EXISTS idx_policies_user_id;
DROP INDEX IF EXISTS idx_applications_status;
DROP INDEX IF EXISTS idx_applications_user_id;

DROP TABLE IF EXISTS application_comments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS policies;
DROP TABLE IF EXISTS application_status_history;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

COMMIT;