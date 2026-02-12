package policy

import (
	"buggy_insurance/internal/domain"
	policy_repository "buggy_insurance/internal/repository/policy"
	"context"
)

func (u *UseCase) GetPolicies(ctx context.Context, userID, page, limit, offset int32, status string) (*domain.GetPoliciesResponse, error) {
	res := new(domain.GetPoliciesResponse)

	policies, err := u.repo.GetPolicies(ctx, &policy_repository.GetPoliciesParams{
		UserID:  &userID,
		Column2: status,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		return nil, err
	}

	total, err := u.repo.GetPoliciesCount(ctx, &policy_repository.GetPoliciesCountParams{
		UserID:  &userID,
		Column2: status,
	})
	if err != nil {
		return nil, err
	}

	res.Policies = make([]domain.Policy, len(policies))
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

	res.Pagination = domain.Pagination{
		Page:  page,
		Limit: limit,
		Total: int32(total),
	}

	return res, nil
}
