package custom_errors

import (
	"errors"

	"github.com/golang-jwt/jwt/v4"
)

var (
	ErrSecretNotSet  = jwt.NewValidationError("JWT_SECRET not set", jwt.ValidationErrorUnverifiable)
	ErrInternal      = errors.New("internal server error") // 500
	ErrBadRequest    = errors.New("bad request")           // 400
	ErrUnauthorized  = errors.New("unauthorized")          // 401
	ErrForbidden     = errors.New("forbidden")             // 403
	ErrNotFound      = errors.New("resource not found")    // 404
	ErrConflict      = errors.New("conflict")              // 409
	ErrValidation    = errors.New("validation failed")     // 422
	ErrUnprocessable = errors.New("unprocessable entity")  // 422
)
