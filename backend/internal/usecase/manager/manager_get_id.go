package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
)

func (u *UseCase) GetManagerApplicationByID(
	ctx context.Context,
	applicationID int32,
) (*domain.ManagerApplicationDetail, error) {

	app, err := u.repo.GetManagerApplicationByID(ctx, &application_repository.GetManagerApplicationByIDParams{ID: applicationID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, custom_errors.ErrNotFound
		}
		return nil, fmt.Errorf("fetch application: %w", custom_errors.ErrInternal)
	}

	historyRows, err := u.repo.GetApplicationStatusHistory(ctx, &application_repository.GetApplicationStatusHistoryParams{ApplicationID: &applicationID})
	if err != nil {
		return nil, fmt.Errorf("fetch status history: %w", custom_errors.ErrInternal)
	}

	commentRows, err := u.repo.GetApplicationComments(ctx, &application_repository.GetApplicationCommentsParams{ApplicationID: &applicationID})
	if err != nil {
		return nil, fmt.Errorf("fetch comments: %w", custom_errors.ErrInternal)
	}

	res := &domain.ManagerApplicationDetail{
		ID: app.ID,
		Client: domain.ClientFull{
			ID:       app.ClientID,
			FullName: *app.ClientFullName,
			Email:    app.ClientEmail,
			Phone:    "",
		},
		ProductType:     app.ProductType,
		Status:          app.Status,
		Data:            app.Data,
		CalculatedPrice: int(app.CalculatedPrice.Int.Int64()),
		CreatedAt:       app.CreatedAt.Time,
		StatusHistory:   make([]domain.ApplicationStatusHistory, len(historyRows)),
		Comments:        make([]domain.ApplicationComment, len(commentRows)),
	}

	// безопасная работа с nullable полями
	if app.ClientPhone != nil {
		res.Client.Phone = *app.ClientPhone
	}

	u.logger.Info("Statuses", zap.Any("Rows", historyRows))
	for i, h := range historyRows {
		u.logger.Info("Row", zap.Any("historyRow", h))
		res.StatusHistory[i] = domain.ApplicationStatusHistory{
			OldStatus: safeString(h.OldStatus),
			NewStatus: h.NewStatus,
			ChangedBy: int64(safeInt32(h.ChangedBy)),
			Comment:   safeString(h.Comment),
			CreatedAt: h.CreatedAt.Time,
		}
	}

	for i, c := range commentRows {
		res.Comments[i] = domain.ApplicationComment{
			ID:        c.ID,
			AuthorID:  safeInt32(&c.AuthorID),
			Author:    safeString(c.AuthorFullName),
			Comment:   c.Comment,
			CreatedAt: c.CreatedAt.Time,
		}
	}

	return res, nil
}

func safeString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func safeInt32(i *int32) int32 {
	if i == nil {
		return 0
	}
	return *i
}
