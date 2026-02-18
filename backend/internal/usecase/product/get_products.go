package product

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	"context"
	"fmt"
)

func (u *UseCase) GetProducts(ctx context.Context) (*domain.GetProductsResponse, error) {
	products, err := u.repo.GetProducts(ctx)
	if err != nil {
		return nil, fmt.Errorf("get products: %w", custom_errors.ErrInternal)
	}

	res := &domain.GetProductsResponse{
		Products: make([]domain.Product, len(products)),
	}

	for i, p := range products {
		res.Products[i] = domain.Product{
			ID:          int(p.ID),
			Type:        p.Type,
			Name:        p.Name,
			Description: derefString(p.Description),
			BasePrice:   int(p.BasePrice.Int.Int64()),
		}
	}

	return res, nil
}
