package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
)

func (u *UseCase) CreateApplicationComment(
	ctx context.Context,
	applicationID, managerID int32,
	comment string,
) (*domain.CreateApplicationCommentResponse, error) {
	dbComment, err := u.repo.CreateApplicationCommentt(ctx, &application_repository.CreateApplicationCommenttParams{
		ApplicationID: &applicationID,
		UserID:        &managerID,
		Comment:       comment,
	})
	if err != nil {
		return nil, err
	}

	author, err := u.repo.GetUserByID(ctx, &application_repository.GetUserByIDParams{ID: managerID})
	if err != nil {
		return nil, err
	}

	return &domain.CreateApplicationCommentResponse{
		ID:        dbComment.ID,
		Comment:   dbComment.Comment,
		CreatedAt: dbComment.CreatedAt.Time,
		Author: domain.CommentAuthor{
			ID:       author.ID,
			FullName: author.FullName,
		},
	}, nil
}
