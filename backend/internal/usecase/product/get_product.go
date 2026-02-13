package product

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	product_repository "buggy_insurance/internal/repository/product"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func (u *UseCase) GetProduct(
	ctx context.Context,
	productType string,
) (*domain.ProductResponse, error) {

	if productType == "" {
		return nil, fmt.Errorf("product type is empty: %w", custom_errors.ErrBadRequest)
	}

	products, err := u.repo.GetProductWithType(
		ctx,
		&product_repository.GetProductWithTypeParams{Type: productType},
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("product not found: %w", custom_errors.ErrNotFound)
		}
		return nil, fmt.Errorf("get product by type: %w", custom_errors.ErrInternal)
	}

	res := &domain.ProductResponse{
		Products:   make([]domain.Product, len(products)),
		FormFields: domain.ProductFormFields[productType],
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

func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
