package product

import (
	"buggy_insurance/internal/domain"
	product_repository "buggy_insurance/internal/repository/product"
	"context"
)

func (u *UseCase) GetProduct(ctx context.Context, productType string) (*domain.ProductResponse, error) {
	res := new(domain.ProductResponse)
	products, err := u.repo.GetProductWithType(ctx, &product_repository.GetProductWithTypeParams{Type: productType})
	if err != nil {
		return nil, err
	}
	res.Products = make([]domain.Product, 0, len(products))
	for i, product := range products {
		res.Products[i].Type = product.Type
		res.Products[i].Name = product.Name
		res.Products[i].Description = *product.Description
		res.Products[i].BasePrice = int(product.BasePrice.Int.Int64())
		res.Products[i].ID = int(product.ID)
	}

	res.FormFields = domain.ProductFormFields[productType]

	return res, nil
}
