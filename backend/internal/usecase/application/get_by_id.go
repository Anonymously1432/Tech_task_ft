package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
)

func (u *UseCase) GetByID(ctx context.Context, applicationID int32) (*domain.ApplicationDetail, error) {
	app, err := u.repo.GetApplicationByID(ctx, &application_repository.GetApplicationByIDParams{ID: applicationID})
	if err != nil {
		return nil, err
	}

	historyRows, err := u.repo.GetApplicationStatusHistory(ctx, &application_repository.GetApplicationStatusHistoryParams{ApplicationID: &applicationID})
	if err != nil {
		return nil, err
	}

	res := &domain.ApplicationDetail{
		ID:              app.ID,
		ProductType:     app.ProductType,
		Status:          app.Status,
		Data:            app.Data,
		CalculatedPrice: int(app.CalculatedPrice.Int.Int64()),
		CreatedAt:       app.CreatedAt.Time,
		StatusHistory:   make([]domain.ApplicationStatus, len(historyRows)),
	}

	for i, h := range historyRows {
		res.StatusHistory[i] = domain.ApplicationStatus{
			OldStatus: *h.OldStatus,
			NewStatus: h.NewStatus,
			ChangedBy: int64(*h.ChangedBy),
			Comment:   *h.Comment,
			ChangedAt: h.CreatedAt.Time,
		}
	}

	return res, nil
}
