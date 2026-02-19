package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"
	"time"

	"go.uber.org/zap"
)

func (u *UseCase) GetManagerApplications(
	ctx context.Context,
	page, limit, offset int32,
	status, productType *string,
	dateFrom, dateTo *time.Time,
	clientID *int32,
) (*domain.GetManagerApplicationsResponse, error) {

	u.logger.Info("Params", zap.Any("", application_repository.GetManagerApplicationsParams{
		Limit:  limit,
		Offset: offset,
	}))

	apps, err := u.repo.GetManagerApplications(ctx, &application_repository.GetManagerApplicationsParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("fetch applications: %w", custom_errors.ErrInternal)
	}

	total, err := u.repo.GetManagerApplicationsCount(ctx)
	if err != nil {
		return nil, fmt.Errorf("fetch applications count: %w", custom_errors.ErrInternal)
	}

	res := &domain.GetManagerApplicationsResponse{
		Applications: make([]domain.ManagerApplication, len(apps)),
		Pagination: domain.Pagination{
			Page:  page,
			Limit: limit,
			Total: int32(total),
		},
	}

	for i, a := range apps {
		res.Applications[i] = domain.ManagerApplication{
			ID: a.ID,
			Client: domain.ClientShort{
				ID:       a.ClientID,
				FullName: *a.ClientFullName,
				Email:    a.ClientEmail,
			},
			ProductType:     a.ProductType,
			Status:          a.Status,
			CalculatedPrice: int(a.CalculatedPrice.Int.Int64()),
			CreatedAt:       a.CreatedAt.Time,
		}
	}

	return res, nil
}
