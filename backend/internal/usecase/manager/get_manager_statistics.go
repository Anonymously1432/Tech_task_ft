package manager

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) GetManagerStatistics(ctx context.Context, period string) (*domain.ManagerStatisticsResponse, error) {
	var periodStart time.Time
	now := time.Now()

	switch period {
	case "week":
		periodStart = now.AddDate(0, 0, -7)
	case "month":
		periodStart = now.AddDate(0, -1, 0)
	case "quarter":
		periodStart = now.AddDate(0, -3, 0)
	case "year":
		periodStart = now.AddDate(-1, 0, 0)
	default:
		periodStart = now.AddDate(0, -1, 0)
	}

	byTypeRows, err := u.repo.GetApplicationsCountByType(ctx, &application_repository.GetApplicationsCountByTypeParams{CreatedAt: pgtype.Timestamp{Time: periodStart, Valid: true}})
	if err != nil {
		return nil, err
	}
	byStatusRows, err := u.repo.GetApplicationsCountByStatus(ctx, &application_repository.GetApplicationsCountByStatusParams{CreatedAt: pgtype.Timestamp{Time: periodStart, Valid: true}})
	if err != nil {
		return nil, err
	}
	conv, err := u.repo.GetApplicationsConversion(ctx, &application_repository.GetApplicationsConversionParams{CreatedAt: pgtype.Timestamp{Time: periodStart, Valid: true}})
	if err != nil {
		return nil, err
	}

	byType := make(map[string]int32)
	for _, r := range byTypeRows {
		byType[r.ProductType] = int32(r.Total)
	}

	byStatus := make(map[string]int32)
	for _, r := range byStatusRows {
		byStatus[r.Status] = int32(r.Total)
	}

	rate := 0.0
	if conv.Total > 0 {
		rate = float64(conv.Approved) / float64(conv.Total)
	}

	return &domain.ManagerStatisticsResponse{
		Period:   period,
		ByType:   byType,
		ByStatus: byStatus,
		Conversion: domain.ConversionStats{
			Total:    int32(conv.Total),
			Approved: int32(conv.Approved),
			Rejected: int32(conv.Rejected),
			Rate:     rate,
		},
	}, nil
}
