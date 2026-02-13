package client

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"fmt"
	"strings"
)

func (u *UseCase) UpdateUser(ctx context.Context, ID int32, fullName, email, address string) (*domain.GetUserResponse, error) {
	user, err := u.repo.UpdateUser(ctx, &user_repository.UpdateUserParams{
		ID:       ID,
		FullName: fullName,
		Email:    email,
		Address:  &address,
	})
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return nil, fmt.Errorf("email already exists: %w", custom_errors.ErrConflict)
		}
		return nil, fmt.Errorf("update user: %w", custom_errors.ErrInternal)
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
