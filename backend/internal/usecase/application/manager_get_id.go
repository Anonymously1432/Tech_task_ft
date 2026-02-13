package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
)

func (u *UseCase) GetManagerApplicationByID(
	ctx context.Context,
	applicationID int32,
) (*domain.ManagerApplicationDetail, error) {

	app, err := u.repo.GetManagerApplicationByID(ctx, &application_repository.GetManagerApplicationByIDParams{ID: applicationID})
	if err != nil {
		return nil, err
	}

	history, err := u.repo.GetApplicationStatusHistory(ctx, &application_repository.GetApplicationStatusHistoryParams{ApplicationID: &applicationID})
	if err != nil {
		return nil, err
	}

	comments, err := u.repo.GetApplicationComments(ctx, &application_repository.GetApplicationCommentsParams{ApplicationID: &applicationID})
	if err != nil {
		return nil, err
	}

	res := &domain.ManagerApplicationDetail{
		ID: app.ID,
		Client: domain.ClientFull{
			ID:       app.ClientID,
			FullName: app.ClientFullName,
			Email:    app.ClientEmail,
			Phone:    *app.ClientPhone,
		},
		ProductType:     app.ProductType,
		Status:          app.Status,
		Data:            app.Data,
		CalculatedPrice: int(app.CalculatedPrice.Int.Int64()),
		CreatedAt:       app.CreatedAt.Time,
		StatusHistory:   make([]domain.ApplicationStatusHistory, len(history)),
		Comments:        make([]domain.ApplicationComment, len(comments)),
	}

	for i, h := range history {
		res.StatusHistory[i] = domain.ApplicationStatusHistory{
			OldStatus: *h.OldStatus,
			NewStatus: h.NewStatus,
			ChangedBy: int64(*h.ChangedBy),
			Comment:   *h.Comment,
			CreatedAt: h.CreatedAt.Time,
		}
	}

	for i, c := range comments {
		res.Comments[i] = domain.ApplicationComment{
			ID:        c.ID,
			AuthorID:  c.AuthorID,
			Author:    c.AuthorFullName,
			Comment:   c.Comment,
			CreatedAt: c.CreatedAt.Time,
		}
	}

	return res, nil
}
