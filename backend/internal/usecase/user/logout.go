package user

import (
	custom_errors "buggy_insurance/internal/errors"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"fmt"

	"go.uber.org/zap"
)

func (u *UseCase) Logout(ctx context.Context, refreshToken string) error {
	if refreshToken == "" {
		return fmt.Errorf("refresh token is empty: %w", custom_errors.ErrBadRequest)
	}

	err := u.repo.DeleteToken(ctx, &user_repository.DeleteTokenParams{
		Token: refreshToken,
	})
	if err != nil {
		u.logger.Error("Delete token error", zap.Error(err))
		return fmt.Errorf("delete refresh token: %w", custom_errors.ErrInternal)
	}

	u.logger.Info("Logout success", zap.String("refresh_token", refreshToken))
	return nil
}
