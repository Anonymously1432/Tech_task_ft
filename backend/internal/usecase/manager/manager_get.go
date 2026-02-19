package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

func (u *UseCase) GetManagerApplications(
	ctx context.Context,
	page, limit, offset int32,
	status, productType *string,
	dateFrom, dateTo *time.Time,
	clientID *int32,
) (*domain.GetManagerApplicationsResponse, error) {

	s := ""
	pt := ""
	cid := int32(0)
	from := time.Time{}
	to := time.Time{}

	if status != nil {
		s = *status
	}
	if productType != nil {
		pt = *productType
	}
	if clientID != nil {
		cid = *clientID
	}
	if dateFrom != nil {
		from = *dateFrom
	}
	if dateTo != nil {
		to = *dateTo
	}

	u.logger.Info("Params", zap.Any("asdfa", application_repository.GetManagerApplicationsParams{
		Column1: s,
		Column2: pt,
		Column3: pgtype.Timestamp{Time: from, Valid: !from.IsZero()},
		Column4: pgtype.Timestamp{Time: to, Valid: !to.IsZero()},
		Column5: cid,
		Limit:   limit,
		Offset:  offset,
	}))

	apps, err := u.repo.GetManagerApplications(ctx, &application_repository.GetManagerApplicationsParams{
		Column1: s,
		Column2: pt,
		Column3: pgtype.Timestamp{Time: from, Valid: !from.IsZero()},
		Column4: pgtype.Timestamp{Time: to, Valid: !to.IsZero()},
		Column5: cid,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, fmt.Errorf("fetch applications: %w", custom_errors.ErrInternal)
	}

	total, err := u.repo.GetManagerApplicationsCount(ctx, &application_repository.GetManagerApplicationsCountParams{
		Column1: s,
		Column2: pt,
		Column3: pgtype.Timestamp{Time: from, Valid: !from.IsZero()},
		Column4: pgtype.Timestamp{Time: to, Valid: !to.IsZero()},
		Column5: cid,
	})
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
