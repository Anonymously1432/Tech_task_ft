package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"errors"
)

func (u *UseCase) UpdateApplicationStatus(
	ctx context.Context,
	applicationID int32,
	status string,
	comment string,
	rejectionReason *string,
) (*domain.UpdateApplicationStatusResponse, error) {

	if status == "REJECTED" && rejectionReason == nil {
		return nil, errors.New("rejectionReason is required for REJECTED status")
	}

	app, err := u.repo.UpdateApplicationStatus(ctx, &application_repository.UpdateApplicationStatusParams{
		ID:              applicationID,
		Status:          status,
		RejectionReason: rejectionReason,
	})
	if err != nil {
		return nil, err
	}

	if comment != "" {
		err = u.repo.CreateApplicationComment(ctx, &application_repository.CreateApplicationCommentParams{
			ApplicationID: &applicationID,
			Comment:       comment,
		})
		if err != nil {
			return nil, err
		}
	}

	return &domain.UpdateApplicationStatusResponse{
		ID:        int64(app.ID),
		Status:    app.Status,
		UpdatedAt: app.UpdatedAt.Time,
	}, nil
}
