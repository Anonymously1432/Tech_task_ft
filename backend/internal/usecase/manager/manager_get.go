package manager

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) GetManagerApplications(
	ctx context.Context,
	page, limit, offset int32,
	status, productType *string,
	dateFrom, dateTo *time.Time,
	clientID *int32,
) (*domain.GetManagerApplicationsResponse, error) {
	apps, err := u.repo.GetManagerApplications(ctx, &application_repository.GetManagerApplicationsParams{
		Column1: *status,
		Column2: *productType,
		Column3: pgtype.Timestamp{Time: *dateFrom, Valid: true},
		Column4: pgtype.Timestamp{Time: *dateTo, Valid: true},
		Column5: *clientID,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, err
	}

	total, err := u.repo.GetManagerApplicationsCount(ctx, &application_repository.GetManagerApplicationsCountParams{
		Column1: *status,
		Column2: *productType,
		Column3: pgtype.Timestamp{Time: *dateFrom, Valid: true},
		Column4: pgtype.Timestamp{Time: *dateTo, Valid: true},
		Column5: *clientID,
	})
	if err != nil {
		return nil, err
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
				FullName: a.ClientFullName,
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
