package user

import (
	custom_errors "buggy_insurance/internal/errors"
	"buggy_insurance/internal/helpers"
	"context"
	"fmt"
	"strconv"

	"github.com/golang-jwt/jwt/v4"
	"go.uber.org/zap"
)

func (u *UseCase) Refresh(ctx context.Context, refreshToken string) (string, error) {
	if refreshToken == "" {
		return "", fmt.Errorf("refresh token is empty: %w", custom_errors.ErrBadRequest)
	}

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %w", custom_errors.ErrBadRequest)
		}
		return []byte(u.secret), nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid or expired refresh token: %w", custom_errors.ErrBadRequest)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid refresh token claims: %w", custom_errors.ErrBadRequest)
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		return "", fmt.Errorf("refresh token missing subject: %w", custom_errors.ErrBadRequest)
	}

	userID, err := strconv.Atoi(sub)
	if err != nil {
		return "", fmt.Errorf("invalid user ID in refresh token: %w", custom_errors.ErrBadRequest)
	}

	accessToken, err := helpers.GenerateAccessToken(int32(userID), u.secret)
	if err != nil {
		u.logger.Error("Generate access token error", zap.Error(err))
		return "", fmt.Errorf("generate access token: %w", custom_errors.ErrInternal)
	}

	u.logger.Info("Refresh token success", zap.Int("user_id", userID))
	return accessToken, nil
}
