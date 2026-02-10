package user

import (
	"buggy_insurance/internal/helpers"
	"context"
	"errors"
	"strconv"

	"github.com/golang-jwt/jwt/v4"
)

func (u *UseCase) Refresh(ctx context.Context, refreshToken string) (string, error) {
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(u.secret), nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid or expired refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid refresh token claims")
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("refresh token has no subject")
	}

	userID, err := strconv.Atoi(sub)
	if err != nil {
		return "", errors.New("invalid user id in refresh token")
	}

	accessToken, err := helpers.GenerateAccessToken(int32(userID), u.secret)
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
