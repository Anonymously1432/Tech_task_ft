package user

import (
	custom_errors "buggy_insurance/internal/errors"
	"buggy_insurance/internal/helpers"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

func (u *UseCase) Login(
	ctx context.Context,
	userEmail, userPassword string,
) (*user_repository.GetByEmailRow, string, string, error) {
	user, err := u.repo.GetByEmail(ctx, &user_repository.GetByEmailParams{
		Email: userEmail,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, "", "", fmt.Errorf("user not found: %w", custom_errors.ErrNotFound)
		}
		u.logger.Error("Get user by email error", zap.Error(err))
		return nil, "", "", fmt.Errorf("get user by email: %w", custom_errors.ErrInternal)
	}

	if !helpers.CheckPassword(user.PasswordHash, userPassword) {
		u.logger.Error("Invalid password", zap.String("user", userEmail))
		return nil, "", "", fmt.Errorf("invalid password: %w", custom_errors.ErrUnauthorized)
	}

	accessToken, err := helpers.GenerateAccessToken(user.ID, u.secret)
	if err != nil {
		u.logger.Error("Generate access token error", zap.Error(err))
		return nil, "", "", fmt.Errorf("generate access token: %w", custom_errors.ErrInternal)
	}

	refreshToken, err := helpers.GenerateRefreshToken(user.ID, u.secret)
	if err != nil {
		u.logger.Error("Generate refresh token error", zap.Error(err))
		return nil, "", "", fmt.Errorf("generate refresh token: %w", custom_errors.ErrInternal)
	}

	if err := u.repo.CreateToken(ctx, &user_repository.CreateTokenParams{
		UserID:    &user.ID,
		Token:     refreshToken,
		ExpiresAt: pgtype.Timestamp{Time: time.Now().Add(7 * 24 * time.Hour), Valid: true},
	}); err != nil {
		u.logger.Error("Create refresh token in db error", zap.Error(err))
		return nil, "", "", fmt.Errorf("create refresh token: %w", custom_errors.ErrInternal)
	}

	return user, accessToken, refreshToken, nil
}
