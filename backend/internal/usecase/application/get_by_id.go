package application

import (
	"buggy_insurance/internal/domain"
	"buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func (u *UseCase) GetByID(ctx context.Context, applicationID int32) (*domain.ApplicationDetail, error) {
	app, err := u.repo.GetApplicationByID(ctx, &application_repository.GetApplicationByIDParams{
		ID: applicationID,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, custom_errors.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get application: %w", custom_errors.ErrInternal)
	}

	historyRows, err := u.repo.GetApplicationStatusHistory(ctx, &application_repository.GetApplicationStatusHistoryParams{
		ApplicationID: &applicationID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get status history: %w", custom_errors.ErrInternal)
	}

	res := &domain.ApplicationDetail{
		ID:              app.ID,
		ProductType:     app.ProductType,
		Status:          app.Status,
		Data:            app.Data,
		CalculatedPrice: 0,
		CreatedAt:       app.CreatedAt.Time,
		StatusHistory:   make([]domain.ApplicationStatus, len(historyRows)),
	}

	if app.CalculatedPrice.Valid && app.CalculatedPrice.Int != nil {
		res.CalculatedPrice = int(app.CalculatedPrice.Int.Int64())
	}

	for i, h := range historyRows {
		oldStatus := ""
		if h.OldStatus != nil {
			oldStatus = *h.OldStatus
		}
		newStatus := ""
		if h.NewStatus != "" {
			newStatus = h.NewStatus
		}
		changedBy := int64(0)
		if h.ChangedBy != nil {
			changedBy = int64(*h.ChangedBy)
		}
		comment := ""
		if h.Comment != nil {
			comment = *h.Comment
		}

		res.StatusHistory[i] = domain.ApplicationStatus{
			OldStatus: oldStatus,
			NewStatus: newStatus,
			ChangedBy: changedBy,
			Comment:   comment,
			ChangedAt: h.CreatedAt.Time,
		}
	}

	return res, nil
}
