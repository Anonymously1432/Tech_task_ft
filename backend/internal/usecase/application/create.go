package application

import (
	"buggy_insurance/internal/domain"
	"buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

func (u *UseCase) Create(ctx context.Context, data string, userID, productID, managerID int32, productType string) (*domain.Application, error) {
	price := RandomInt(30000, 50000)

	var calculatedPrice pgtype.Numeric
	if err := calculatedPrice.Scan(strconv.Itoa(price)); err != nil {
		u.logger.Error("failed to scan calculated price", zap.Error(err))
		return nil, fmt.Errorf("failed to calculate price: %w", custom_errors.ErrInternal)
	}

	application, err := u.repo.CreateApplication(ctx, &application_repository.CreateApplicationParams{
		UserID:          &userID,
		ProductID:       &productID,
		Data:            []byte(data),
		CalculatedPrice: calculatedPrice,
		ManagerID:       &managerID,
	})
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return nil, fmt.Errorf("application already exists: %w", custom_errors.ErrConflict)
		}
		u.logger.Error("failed to create application", zap.Error(err))
		return nil, fmt.Errorf("failed to create application: %w", custom_errors.ErrInternal)
	}

	return &domain.Application{
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
