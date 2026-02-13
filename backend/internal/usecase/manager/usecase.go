package manager

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"time"

	"go.uber.org/zap"
)

type IUseCase interface {
	GetManagerApplications(
		ctx context.Context,
		page, limit, offset int32,
		status, productType *string,
		dateFrom, dateTo *time.Time,
		clientID *int32,
	) (*domain.GetManagerApplicationsResponse, error)
	GetManagerApplicationByID(
		ctx context.Context,
		applicationID int32,
	) (*domain.ManagerApplicationDetail, error)
	UpdateApplicationStatus(
		ctx context.Context,
		applicationID int32,
		status string,
		comment string,
		rejectionReason *string,
	) (*domain.UpdateApplicationStatusResponse, error)
	CreateApplicationComment(
		ctx context.Context,
		applicationID, managerID int32,
		comment string,
	) (*domain.CreateApplicationCommentResponse, error)
	GetManagerStatistics(ctx context.Context, period string) (*domain.ManagerStatisticsResponse, error)
}

type UseCase struct {
	logger *zap.Logger
	repo   *application_repository.Queries
}

func NewUseCase(logger *zap.Logger, repo *application_repository.Queries) IUseCase {
	return &UseCase{
		logger: logger,
		repo:   repo,
	}
}
