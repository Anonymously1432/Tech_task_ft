package client

import (
	"buggy_insurance/internal/domain"
	user_repository "buggy_insurance/internal/repository/user"
	"context"

	"go.uber.org/zap"
)

func (u *UseCase) UpdateUser(ctx context.Context, ID int32, fullName, email, address string) (*domain.GetUserResponse, error) {
	user, err := u.repo.UpdateUser(ctx, &user_repository.UpdateUserParams{
		ID:       ID,
		FullName: fullName,
		Email:    email,
		Address:  &address,
	})
	if err != nil {
		u.logger.Error("UpdateUser error", zap.Error(err))
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
	}, nil
}
