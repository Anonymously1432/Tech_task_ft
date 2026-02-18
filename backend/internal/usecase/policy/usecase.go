package policy

import (
	"buggy_insurance/internal/domain"
	policy_repository "buggy_insurance/internal/repository/policy"
	"context"

	"go.uber.org/zap"
)

type IUseCase interface {
	GetPolicies(ctx context.Context, userID, page, limit, offset int32, status string) (*domain.GetPoliciesResponse, error)
}

type UseCase struct {
	logger *zap.Logger
	repo   *policy_repository.Queries
}

func NewUseCase(logger *zap.Logger, repo *policy_repository.Queries) IUseCase {
	return &UseCase{
		logger: logger,
		repo:   repo,
	}
}
