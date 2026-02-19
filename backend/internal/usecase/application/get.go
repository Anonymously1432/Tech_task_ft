package application

import (
	"buggy_insurance/internal/domain"
	"buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"

	"go.uber.org/zap"
)

func (u *UseCase) Get(ctx context.Context, userID, page, limit, offset int32, status *string) (*domain.GetApplicationsResponse, error) {
	res := new(domain.GetApplicationsResponse)

	applications, err := u.repo.GetApplications(ctx, &application_repository.GetApplicationsParams{
		Column1: status,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get applications: %w", custom_errors.ErrInternal)
	}
	u.logger.Info("apps", zap.Any("applications", applications))
	count, err := u.repo.GetApplicationsCount(ctx, &application_repository.GetApplicationsCountParams{
		UserID:  &userID,
		Column2: status,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get applications count: %w", custom_errors.ErrInternal)
	}

	res.Applications = make([]domain.Application, len(applications))
	for i, application := range applications {
		res.Applications[i].ID = application.ID
		res.Applications[i].Status = application.Status
		res.Applications[i].ProductType = application.ProductType
		res.Applications[i].CreatedAt = application.CreatedAt.Time
		if application.CalculatedPrice.Valid {
			res.Applications[i].CalculatedPrice = int(application.CalculatedPrice.Int.Int64())
		}
	}

	res.Pagination = domain.Pagination{
		Page:  page,
		Limit: limit,
		Total: int32(count),
	}

	u.logger.Info("Applications", zap.Any("applications", res.Applications))
	return res, nil
}
