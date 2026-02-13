package client

import (
	"buggy_insurance/internal/domain"
	user_repository "buggy_insurance/internal/repository/user"
	"context"
)

func (u *UseCase) GetDashboard(ctx context.Context, userID int32) (*domain.DashboardResponse, error) {
	user, err := u.repo.GetByID(ctx, &user_repository.GetByIDParams{ID: userID})
	if err != nil {
		return nil, err
	}

	activePoliciesCount, err := u.repo.CountUserPolicies(ctx, &user_repository.CountUserPoliciesParams{
		UserID: &userID,
		Status: "ACTIVE",
	})
	if err != nil {
		return nil, err
	}

	totalCoverage, err := u.repo.SumUserPoliciesCoverage(ctx, &user_repository.SumUserPoliciesCoverageParams{
		UserID: &userID,
		Status: "ACTIVE",
	})
	if err != nil {
		return nil, err
	}

	pendingApplications, err := u.repo.CountUserApplications(ctx, &user_repository.CountUserApplicationsParams{
		UserID: &userID,
		Status: "NEW",
	})
	if err != nil {
		return nil, err
	}

	recentActivities, err := u.repo.GetRecentUserActivity(ctx, &user_repository.GetRecentUserActivityParams{
		UserID: &userID,
		Limit:  5,
	})
	if err != nil {
		return nil, err
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
			FullName: user.FullName,
		},
		Stats: domain.DashboardStats{
			ActivePolicies:      activePoliciesCount,
			TotalCoverage:       totalCoverage.(float64),
			PendingApplications: pendingApplications,
		},
		RecentActivity: activityEntries,
	}, nil
}
