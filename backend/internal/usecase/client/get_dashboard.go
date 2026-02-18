package client

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"database/sql"
	"errors"
	"fmt"
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
		totalCoverage = totalCoverageRaw.(float64)
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
		activityEntries[i] = domain.ActivityEntry{
			ID:              a.ID,
			Type:            a.Type,
			Status:          a.Status,
			CreatedAt:       a.CreatedAt.Time,
			ProductType:     a.ProductType,
			CalculatedPrice: a.CalculatedPrice.Int.Int64(),
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
