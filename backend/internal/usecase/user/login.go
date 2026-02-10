package user

import (
	"buggy_insurance/internal/helpers"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"strconv"
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
		u.logger.Error("Get user by email error", zap.Error(err))
		return nil, "", "", err
	}

	isSuccess := helpers.CheckPassword(user.PasswordHash, userPassword)
	if !isSuccess {
		u.logger.Error("Invalid password", zap.String("user", userEmail))
		return nil, "", "", err
	}

	accessToken, refreshToken, err := helpers.GenerateTokens(user.ID)
	if err != nil {
		u.logger.Error("Generate tokens error", zap.Error(err))
		return nil, "", "", err
	}

	err = u.repo.CreateToken(ctx, &user_repository.CreateTokenParams{
		UserID:    &user.ID,
		Token:     refreshToken,
		ExpiresAt: pgtype.Timestamp{Time: time.Now().Add(7 * 24 * time.Hour), Valid: true},
	})

	u.logger.Info("Login success", zap.Any("UserID", strconv.Itoa(int(user.ID))))
	return user, accessToken, refreshToken, nil
}
