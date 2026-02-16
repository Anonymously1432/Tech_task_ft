package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

func (u *UseCase) CreateApplicationComment(
	ctx context.Context,
	applicationID, managerID int32,
	comment string,
) (*domain.CreateApplicationCommentResponse, error) {

	if strings.TrimSpace(comment) == "" {
		return nil, fmt.Errorf("comment is empty: %w", custom_errors.ErrUnprocessable)
	}

	dbComment, err := u.repo.CreateApplicationCommentt(ctx, &application_repository.CreateApplicationCommenttParams{
		ApplicationID: &applicationID,
		UserID:        &managerID,
		Comment:       comment,
	})
	if err != nil {
		return nil, fmt.Errorf("create application comment: %w", custom_errors.ErrInternal)
	}

	author, err := u.repo.GetUserByID(ctx, &application_repository.GetUserByIDParams{ID: managerID})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("manager not found: %w", custom_errors.ErrNotFound)
		}
		return nil, fmt.Errorf("get manager user: %w", custom_errors.ErrInternal)
	}

	return &domain.CreateApplicationCommentResponse{
		ID:        dbComment.ID,
		Comment:   dbComment.Comment,
		CreatedAt: dbComment.CreatedAt.Time,
		Author: domain.CommentAuthor{
			ID:       author.ID,
			FullName: *author.FullName,
		},
	}, nil
}
