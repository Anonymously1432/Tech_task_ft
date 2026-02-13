package client

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func (u *UseCase) GetUser(ctx context.Context, ID int32) (*domain.GetUserResponse, error) {
	user, err := u.repo.GetByID(ctx, &user_repository.GetByIDParams{ID: ID})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("user not found: %w", custom_errors.ErrNotFound)
		}
		return nil, fmt.Errorf("get user by id: %w", custom_errors.ErrInternal)
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
