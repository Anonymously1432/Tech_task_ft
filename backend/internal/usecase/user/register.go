package user

import (
	"buggy_insurance/internal/helpers"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

func (u *UseCase) Register(
	ctx context.Context,
	email, password, fullName, phone string, birthDate time.Time,
) (*user_repository.CreateUserRow, error) {
	hashPassword, err := helpers.HashPassword(password, u.salt)
	if err != nil {
		u.logger.Error("Failed to hash password", zap.Error(err))
		return nil, err
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
		return nil, err
	}

	u.logger.Info("Successfully created user", zap.String("email", email))
	return user, nil
}
