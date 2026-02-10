package domain

import "time"

type RegisterRequest struct {
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	FullName  string    `json:"fullName"`
	Phone     string    `json:"phone"`
	BirthDate time.Time `json:"birthDate"`
}

type RegisterResponse struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"fullName"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken  string         `json:"accessToken"`
	RefreshToken string         `json:"refreshToken"`
	ExpiresIn    int            `json:"expiresIn"`
	User         FieldsForLogin `json:"user"`
}

type FieldsForLogin struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type RefreshResponse struct {
	AccessToken string `json:"accessToken"`
	ExpiresIn   int    `json:"expiresIn"`
}
