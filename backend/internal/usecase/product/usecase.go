package product

import (
	product_repository "buggy_insurance/internal/repository/product"
	"context"

	"go.uber.org/zap"
)

type IUseCase interface {
	GetProducts(ctx context.Context) ([]*product_repository.GetProductsRow, error)
}

type UseCase struct {
	logger *zap.Logger
	repo   *product_repository.Queries
}

func NewUseCase(logger *zap.Logger, repo *product_repository.Queries) IUseCase {
	return &UseCase{
		logger: logger,
		repo:   repo,
	}
}
