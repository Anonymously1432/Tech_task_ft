package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	application_repository "buggy_insurance/internal/repository/application"
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) GetManagerDashboard(ctx context.Context) (*domain.ManagerDashboardResponse, error) {
	now := time.Now()
	today := now.Truncate(24 * time.Hour)
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	newToday, err := u.repo.CountApplicationsByStatusAndDate(ctx, &application_repository.CountApplicationsByStatusAndDateParams{
		Status:      "NEW",
		UpdatedAt:   pgtype.Timestamp{Time: today, Valid: true},
		UpdatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("count new applications today: %w", custom_errors.ErrInternal)
	}

	underReview, err := u.repo.CountApplicationsByStatus(ctx, &application_repository.CountApplicationsByStatusParams{
		Status: "UNDER_REVIEW",
	})
	if err != nil {
		return nil, fmt.Errorf("count under review applications: %w", custom_errors.ErrInternal)
	}

	approvedThisMonth, err := u.repo.CountApplicationsByStatusAndDateRange(ctx, &application_repository.CountApplicationsByStatusAndDateRangeParams{
		Status:      "APPROVED",
		UpdatedAt:   pgtype.Timestamp{Time: monthStart, Valid: true},
		UpdatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("count approved applications: %w", custom_errors.ErrInternal)
	}

	rejectedThisMonth, err := u.repo.CountApplicationsByStatusAndDateRange(ctx, &application_repository.CountApplicationsByStatusAndDateRangeParams{
		Status:      "REJECTED",
		UpdatedAt:   pgtype.Timestamp{Time: monthStart, Valid: true},
		UpdatedAt_2: pgtype.Timestamp{Time: now, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("count rejected applications: %w", custom_errors.ErrInternal)
	}

	chartRows, err := u.repo.GetApplicationsChartData(ctx)
	if err != nil {
		return nil, fmt.Errorf("get chart data: %w", custom_errors.ErrInternal)
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
		return nil, fmt.Errorf("get recent applications: %w", custom_errors.ErrInternal)
	}

	recent := make([]domain.RecentApplicationEntry, len(recentApps))
	for i, r := range recentApps {
		price, err := NumericToInt64(r.CalculatedPrice)
		if err != nil {
			return nil, fmt.Errorf("convert calculated price: %w", err)
		}
		recent[i] = domain.RecentApplicationEntry{
			ID:              r.ID,
			ClientID:        *r.ClientID,
			ClientFullName:  *r.ClientFullName,
			ProductType:     r.ProductType,
			Status:          r.Status,
			CalculatedPrice: price,
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

func NumericToInt64(n pgtype.Numeric) (int64, error) {
	if !n.Valid {
		return 0, nil
	}

	if n.Int != nil {
		return n.Int.Int64(), nil
	}

	f, err := n.Int64Value()
	if err != nil {
		return 0, err
	}

	return f.Int64, nil
}
