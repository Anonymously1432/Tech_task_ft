package user

import (
	user_repository "buggy_insurance/internal/repository/user"
	"context"

	"go.uber.org/zap"
)

func (u *UseCase) Logout(ctx context.Context, refreshToken string) error {
	err := u.repo.DeleteToken(ctx, &user_repository.DeleteTokenParams{Token: refreshToken})
	if err != nil {
		u.logger.Error("Logout error", zap.Error(err))
		return err
	}
	return nil
}
