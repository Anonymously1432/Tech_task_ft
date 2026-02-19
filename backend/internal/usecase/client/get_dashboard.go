package client

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

func (u *UseCase) GetDashboard(ctx context.Context, userID int32) (*domain.DashboardResponse, error) {
	user, err := u.repo.GetByID(ctx, &user_repository.GetByIDParams{ID: userID})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("user not found: %w", custom_errors.ErrNotFound)
		}
		return nil, fmt.Errorf("get user by id: %w", custom_errors.ErrInternal)
	}

	activePoliciesCount, err := u.repo.CountUserPolicies(ctx, &user_repository.CountUserPoliciesParams{
		UserID: &userID,
		Status: "ACTIVE",
	})
	if err != nil {
		return nil, fmt.Errorf("count active policies: %w", custom_errors.ErrInternal)
	}

	totalCoverageRaw, err := u.repo.SumUserPoliciesCoverage(ctx, &user_repository.SumUserPoliciesCoverageParams{
		UserID: &userID,
		Status: "ACTIVE",
	})
	if err != nil {
		return nil, fmt.Errorf("sum user coverage: %w", custom_errors.ErrInternal)
	}

	totalCoverage := float64(0)

	if totalCoverageRaw != nil {
		numeric, ok := totalCoverageRaw.(pgtype.Numeric)
		if !ok {
			return nil, fmt.Errorf("unexpected totalCoverage type: %T", totalCoverageRaw)
		}

		if numeric.Valid {
			if numeric.Int != nil {
				totalCoverage = float64(numeric.Int.Int64())
			} else {
				f, err := numeric.Float64Value()
				if err != nil {
					return nil, fmt.Errorf("convert numeric to float64: %w", err)
				}
				totalCoverage = f.Float64
			}
		}
	}

	pendingApplications, err := u.repo.CountUserApplications(ctx, &user_repository.CountUserApplicationsParams{
		UserID: &userID,
		Status: "NEW",
	})
	if err != nil {
		return nil, fmt.Errorf("count pending applications: %w", custom_errors.ErrInternal)
	}

	recentActivities, err := u.repo.GetRecentUserActivity(ctx, &user_repository.GetRecentUserActivityParams{
		UserID: &userID,
		Limit:  5,
	})
	if err != nil {
		return nil, fmt.Errorf("get recent activities: %w", custom_errors.ErrInternal)
	}

	activityEntries := make([]domain.ActivityEntry, len(recentActivities))
	for i, a := range recentActivities {
		price, err := NumericToInt64(a.CalculatedPrice)
		if err != nil {
			return nil, fmt.Errorf("convert calculated price: %w", err)
		}

		activityEntries[i] = domain.ActivityEntry{
			ID:              a.ID,
			Type:            a.Type,
			Status:          a.Status,
			CreatedAt:       a.CreatedAt.Time,
			ProductType:     a.ProductType,
			CalculatedPrice: price,
		}
	}

	return &domain.DashboardResponse{
		User: domain.DashboardUser{
			FullName: *user.FullName,
		},
		Stats: domain.DashboardStats{
			ActivePolicies:      activePoliciesCount,
			TotalCoverage:       totalCoverage,
			PendingApplications: pendingApplications,
		},
		RecentActivity: activityEntries,
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
