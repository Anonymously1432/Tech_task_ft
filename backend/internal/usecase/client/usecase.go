package client

import (
	"buggy_insurance/internal/domain"
	user_repository "buggy_insurance/internal/repository/user"
	"context"

	"go.uber.org/zap"
)

type IUseCase interface {
	GetUser(ctx context.Context, ID int32) (*domain.GetUserResponse, error)
	UpdateUser(ctx context.Context, ID int32, fullName, email, address string) (*domain.GetUserResponse, error)
}

type UseCase struct {
	logger *zap.Logger
	repo   *user_repository.Queries
}

func NewUseCase(logger *zap.Logger, repo *user_repository.Queries) IUseCase {
	return &UseCase{
		logger: logger,
		repo:   repo,
	}
}
