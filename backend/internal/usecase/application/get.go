package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
)

func (u *UseCase) Get(ctx context.Context, userID, page, limit, offset int32, status string) (*domain.GetApplicationsResponse, error) {
	res := new(domain.GetApplicationsResponse)
	applications, err := u.repo.GetApplications(ctx, &application_repository.GetApplicationsParams{
		UserID:  &userID,
		Column2: status,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, err
	}
	res.Applications = make([]domain.Application, 0, len(applications))
	count, err := u.repo.GetApplicationsCount(ctx, &application_repository.GetApplicationsCountParams{
		UserID:  &userID,
		Column2: status,
	})
	if err != nil {
		return nil, err
	}
	for i, application := range applications {
		res.Applications[i].Status = application.Status
		res.Applications[i].ID = application.ID
		if application.CalculatedPrice.Valid {
			res.Applications[i].CalculatedPrice = int(application.CalculatedPrice.Int.Int64())
		}
		res.Applications[i].ProductType = application.ProductType
		res.Applications[i].CreatedAt = application.CreatedAt.Time
	}
	res.Pagination = domain.Pagination{
		Page:  page,
		Limit: limit,
		Total: int32(count),
	}
	return res, nil
}
