package product

import (
	"buggy_insurance/internal/domain"
	product_repository "buggy_insurance/internal/repository/product"
	"context"

	"go.uber.org/zap"
)

type IUseCase interface {
	GetProducts(ctx context.Context) (*domain.GetProductsResponse, error)
	GetProduct(ctx context.Context, productType string) (*domain.ProductResponse, error)
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
