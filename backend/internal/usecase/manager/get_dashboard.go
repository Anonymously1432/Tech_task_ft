package manager

import (
	"buggy_insurance/internal/domain"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) GetManagerDashboard(ctx context.Context) (*domain.ManagerDashboardResponse, error) {
	now := time.Now()
	today := now.Truncate(24 * time.Hour)
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	newToday, err := u.repo.CountApplicationsByStatusAndDate(ctx, &application_repository.CountApplicationsByStatusAndDateParams{
		Status:      "NEW",
		CreatedAt:   pgtype.Timestamp{Time: today, Valid: true},
		CreatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	underReview, err := u.repo.CountApplicationsByStatus(ctx, &application_repository.CountApplicationsByStatusParams{
		Status: "UNDER_REVIEW",
	})
	if err != nil {
		return nil, err
	}

	approvedThisMonth, err := u.repo.CountApplicationsByStatusAndDateRange(ctx, &application_repository.CountApplicationsByStatusAndDateRangeParams{
		Status:      "APPROVED",
		CreatedAt:   pgtype.Timestamp{Time: monthStart, Valid: true},
		CreatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	rejectedThisMonth, err := u.repo.CountApplicationsByStatusAndDateRange(ctx, &application_repository.CountApplicationsByStatusAndDateRangeParams{
		Status:      "REJECTED",
		CreatedAt:   pgtype.Timestamp{Time: monthStart, Valid: true},
		CreatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	chartRows, err := u.repo.GetApplicationsChartData(ctx)
	if err != nil {
		return nil, err
	}

	chartData := make([]domain.ChartDataEntry, len(chartRows))
	for i, row := range chartRows {
		chartData[i] = domain.ChartDataEntry{
			Date:     row.Date.Time,
			New:      row.New,
			Approved: row.Approved,
			Rejected: row.Rejected,
		}
	}

	recentApps, err := u.repo.GetRecentApplications(ctx, &application_repository.GetRecentApplicationsParams{Limit: 5})
	if err != nil {
		return nil, err
	}
	recent := make([]domain.RecentApplicationEntry, len(recentApps))
	for i, r := range recentApps {
		recent[i] = domain.RecentApplicationEntry{
			ID:              r.ID,
			ClientID:        *r.ClientID,
			ClientFullName:  r.ClientFullName,
			ProductType:     r.ProductType,
			Status:          r.Status,
			CalculatedPrice: r.CalculatedPrice.Int.Int64(),
			CreatedAt:       r.CreatedAt.Time,
		}
	}

	return &domain.ManagerDashboardResponse{
		Stats: domain.ManagerDashboardStats{
			NewToday:          newToday,
			UnderReview:       underReview,
			ApprovedThisMonth: approvedThisMonth,
			RejectedThisMonth: rejectedThisMonth,
		},
		ChartData:          chartData,
		RecentApplications: recent,
	}, nil
}
