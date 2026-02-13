package application

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"time"

	"go.uber.org/zap"
)

type IUseCase interface {
	Create(ctx context.Context, data []byte, userID, productID, managerID int32, productType string) (*domain.Application, error)
	Get(ctx context.Context, userID, page, limit, offset int32, status string) (*domain.GetApplicationsResponse, error)
	GetByID(ctx context.Context, applicationID int32) (*domain.ApplicationDetail, error)
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
