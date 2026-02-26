package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"

	"go.uber.org/zap"
)

func (u *UseCase) GetManagerApplications(
	ctx context.Context,
	page, limit, offset int32,
	status, productType *string,
	clientID *int32,
) (*domain.GetManagerApplicationsResponse, error) {

	// Преобразуем строковые фильтры в массивы для репозитория
	var statuses []string
	if status != nil && *status != "" {
		statuses = []string{*status}
	}

	var productTypes []string
	if productType != nil && *productType != "" {
		productTypes = []string{*productType}
	}

	// Подготавливаем параметры для запроса
	params := &application_repository.GetManagerApplicationsNewParams{
		Limit:        limit,
		Offset:       offset,
		Statuses:     statuses,
		ProductTypes: productTypes,
	}

	u.logger.Info("GetManagerApplications called",
		zap.Int32("page", page),
		zap.Int32("limit", limit),
		zap.Int32("offset", offset),
		zap.Any("statuses", statuses),
		zap.Any("productTypes", productTypes),
		zap.Any("clientID", clientID),
	)

	// Получаем заявки с фильтрацией
	apps, err := u.repo.GetManagerApplicationsNew(ctx, params)
	if err != nil {
		u.logger.Error("Failed to fetch applications", zap.Error(err))
		return nil, fmt.Errorf("fetch applications: %w", custom_errors.ErrInternal)
	}

	// Получаем общее количество с учетом фильтров
	totalParams := &application_repository.GetManagerApplicationsCountNewParams{
		Statuses:     statuses,
		ProductTypes: productTypes,
		ClientID:     clientID,
	}

	total, err := u.repo.GetManagerApplicationsCountNew(ctx, totalParams)
	if err != nil {
		u.logger.Error("Failed to fetch applications count", zap.Error(err))
		return nil, fmt.Errorf("fetch applications count: %w", custom_errors.ErrInternal)
	}

	res := &domain.GetManagerApplicationsResponse{
		Applications: make([]domain.ManagerApplication, len(apps)),
		Pagination: domain.Pagination{
			Page:  page,
			Limit: limit,
			Total: int32(total),
		},
	}

	for i, a := range apps {
		var calculatedPrice int
		if a.CalculatedPrice.Valid {
			calculatedPrice = int(a.CalculatedPrice.Int.Int64())
		}

		clientFullName := ""
		if a.ClientFullName != nil {
			clientFullName = *a.ClientFullName
		}

		res.Applications[i] = domain.ManagerApplication{
			ID: a.ID,
			Client: domain.ClientShort{
				ID:       a.ClientID,
				FullName: clientFullName,
				Email:    a.ClientEmail,
			},
			ProductType:     a.ProductType,
			Status:          a.Status,
			CalculatedPrice: calculatedPrice,
			CreatedAt:       a.CreatedAt.Time,
		}
	}

	return res, nil
}
