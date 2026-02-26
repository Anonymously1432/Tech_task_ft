package policy

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	policy_repository "buggy_insurance/internal/repository/policy"
	"context"
	"fmt"
)

func (u *UseCase) GetPolicies(
	ctx context.Context,
	userID, page, limit, offset int32,
	status string,
) (*domain.GetPoliciesResponse, error) {

	if status == "" {
		policies, err := u.repo.GetAllPolicies(ctx, &policy_repository.GetAllPoliciesParams{
			UserID: &userID,
			Limit:  limit,
			Offset: offset,
		})
		if err != nil {
			return nil, fmt.Errorf("get policies: %w", custom_errors.ErrInternal)
		}

		total, err := u.repo.GetPoliciesCount(ctx, &policy_repository.GetPoliciesCountParams{
			UserID:  &userID,
			Column2: status,
		})
		if err != nil {
			return nil, fmt.Errorf("get policies count: %w", custom_errors.ErrInternal)
		}

		res := &domain.GetPoliciesResponse{
			Policies: make([]domain.Policy, len(policies)),
			Pagination: domain.Pagination{
				Page:  page,
				Limit: limit,
				Total: int32(total),
			},
		}

		for i, p := range policies {
			res.Policies[i] = domain.Policy{
				ID:             p.ID,
				PolicyNumber:   p.PolicyNumber,
				ProductType:    p.ProductType,
				Status:         p.Status,
				StartDate:      p.StartDate.Time,
				EndDate:        p.EndDate.Time,
				CoverageAmount: int(p.CoverageAmount.Int.Int64()),
				Premium:        int(p.Premium.Int.Int64()),
			}
		}

		return res, nil
	}

	policies, err := u.repo.GetPolicies(ctx, &policy_repository.GetPoliciesParams{
		UserID:  &userID,
		Column2: status,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, fmt.Errorf("get policies: %w", custom_errors.ErrInternal)
	}

	total, err := u.repo.GetPoliciesCount(ctx, &policy_repository.GetPoliciesCountParams{
		UserID:  &userID,
		Column2: status,
	})
	if err != nil {
		return nil, fmt.Errorf("get policies count: %w", custom_errors.ErrInternal)
	}

	res := &domain.GetPoliciesResponse{
		Policies: make([]domain.Policy, len(policies)),
		Pagination: domain.Pagination{
			Page:  page,
			Limit: limit,
			Total: int32(total),
		},
	}

	for i, p := range policies {
		res.Policies[i] = domain.Policy{
			ID:             p.ID,
			PolicyNumber:   p.PolicyNumber,
			ProductType:    p.ProductType,
			Status:         p.Status,
			StartDate:      p.StartDate.Time,
			EndDate:        p.EndDate.Time,
			CoverageAmount: int(p.CoverageAmount.Int.Int64()),
			Premium:        int(p.Premium.Int.Int64()),
		}
	}

	return res, nil
}
