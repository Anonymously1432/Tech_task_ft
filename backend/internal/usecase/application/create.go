package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"math/rand"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) Create(ctx context.Context, data []byte, userID, productID, managerID int32, productType string) (*domain.CreateApplicationResponse, error) {
	price := RandomInt(30000, 50000)

	var calculatedPrice pgtype.Numeric
	if err := calculatedPrice.Scan(price); err != nil {
		return nil, err
	}

	application, err := u.repo.CreateApplication(ctx, &application_repository.CreateApplicationParams{
		UserID:          &userID,
		ProductID:       &productID,
		Data:            data,
		CalculatedPrice: calculatedPrice,
		ManagerID:       &managerID,
	})
	if err != nil {
		return nil, err
	}
	return &domain.CreateApplicationResponse{
		ID:              application.ID,
		Status:          application.Status,
		ProductType:     productType,
		CalculatedPrice: int(calculatedPrice.Int.Int64()),
		CreatedAt:       application.CreatedAt.Time,
	}, nil
}

func RandomInt(min, max int) int {
	return rand.Intn(max-min+1) + min
}
