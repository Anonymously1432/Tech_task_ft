package manager

import (
	"buggy_insurance/internal/domain"
	"fmt"
	"strings"

	application_repository "buggy_insurance/internal/repository/application"
	"context"
)

func (u *UseCase) UpdateApplicationStatus(
	ctx context.Context,
	userID,
	applicationID int32,
	status string,
	comment string,
	rejectionReason *string,
) (*domain.UpdateApplicationStatusResponse, error) {

	if status == "REJECTED" && rejectionReason == nil {
		return nil, fmt.Errorf("rejectionReason is required for REJECTED status")
	}

	app, err := u.repo.UpdateApplicationStatus(ctx, &application_repository.UpdateApplicationStatusParams{
		ID:              applicationID,
		Status:          status,
		RejectionReason: rejectionReason,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update application status: %w", err)
	}

	if strings.TrimSpace(comment) != "" {
		if err = u.repo.CreateApplicationComment(ctx, &application_repository.CreateApplicationCommentParams{
			UserID:        &userID,
			ApplicationID: &applicationID,
			Comment:       comment,
		}); err != nil {
			return nil, fmt.Errorf("failed to create comment: %w", err)
		}
	}

	return &domain.UpdateApplicationStatusResponse{
		ID:        int64(app.ID),
		Status:    app.Status,
		UpdatedAt: app.UpdatedAt.Time,
	}, nil
}
