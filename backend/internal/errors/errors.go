package errors

import "github.com/golang-jwt/jwt/v4"

var (
	ErrSecretNotSet = jwt.NewValidationError("JWT_SECRET not set", jwt.ValidationErrorUnverifiable)
)
