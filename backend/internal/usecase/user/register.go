package user

import (
	custom_errors "buggy_insurance/internal/errors"
	"buggy_insurance/internal/helpers"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

func (u *UseCase) Register(
	ctx context.Context,
	email, password, fullName, phone string,
	birthDate time.Time,
) (*user_repository.CreateUserRow, error) {

	if email == "" || password == "" || fullName == "" {
		return nil, fmt.Errorf("missing required fields: %w", custom_errors.ErrBadRequest)
	}

	hashPassword, err := helpers.HashPassword(password, u.salt)
	if err != nil {
		u.logger.Error("Failed to hash password", zap.Error(err))
		return nil, fmt.Errorf("hash password: %w", custom_errors.ErrInternal)
	}

	user, err := u.repo.CreateUser(ctx, &user_repository.CreateUserParams{
		Email:        email,
		PasswordHash: hashPassword,
		FullName:     fullName,
		Phone:        &phone,
		BirthDate: pgtype.Date{
			Time:  birthDate,
			Valid: true,
		},
	})
	if err != nil {
		u.logger.Error("Failed to create user", zap.Error(err))

		// Обработка уникального email
		if strings.Contains(err.Error(), "users_email_key") {
			return nil, fmt.Errorf("email already exists: %w", custom_errors.ErrConflict)
		}

		return nil, fmt.Errorf("create user: %w", custom_errors.ErrInternal)
	}

	u.logger.Info("Successfully created user", zap.String("email", email))
	return user, nil
}
