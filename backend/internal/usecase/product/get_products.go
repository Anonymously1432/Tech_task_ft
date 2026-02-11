package product

import (
	product_repository "buggy_insurance/internal/repository/product"
	"context"
)

func (u *UseCase) GetProducts(ctx context.Context) ([]*product_repository.GetProductsRow, error) {
	products, err := u.repo.GetProducts(ctx)
	if err != nil {
		return nil, err
	}
	return products, nil
}
