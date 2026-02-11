package client

import (
	"buggy_insurance/internal/domain"
	user_repository "buggy_insurance/internal/repository/user"
	"context"

	"go.uber.org/zap"
)

func (u *UseCase) GetUser(ctx context.Context, ID int32) (*domain.GetUserResponse, error) {
	user, err := u.repo.GetByID(ctx, &user_repository.GetByIDParams{ID: ID})
	if err != nil {
		u.logger.Error("GetUser error", zap.Error(err))
		return nil, err
	}
	return &domain.GetUserResponse{
		ID:        ID,
		Email:     user.Email,
		FullName:  user.FullName,
		Phone:     user.Phone,
		BirthDate: user.BirthDate.Time,
		Address:   user.Address,
		Role:      user.Role,
	}, err
}
