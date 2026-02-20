package helpers

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var (
	accessExpires  = mustParseSeconds(os.Getenv("JWT_ACCESS_EXPIRES"), time.Hour)
	refreshExpires = mustParseSeconds(os.Getenv("JWT_REFRESH_EXPIRES"), 7*24*time.Hour)
)

func GenerateAccessToken(userID int32, secret string) (string, error) {
	accessClaims := jwt.RegisteredClaims{
		Subject:   strconv.Itoa(int(userID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessExpires)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessString, err := accessToken.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return accessString, nil
}

func GenerateRefreshToken(userID int32, secret string) (string, error) {
	refreshClaims := jwt.RegisteredClaims{
		Subject:   strconv.Itoa(int(userID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(refreshExpires)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshString, err := refreshToken.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return refreshString, nil
}

func mustParseSeconds(env string, fallback time.Duration) time.Duration {
	if env == "" {
		return fallback
	}

	sec, err := strconv.Atoi(env)
	if err != nil {
		log.Printf("invalid seconds value %q, using fallback %v", env, fallback)
		return fallback
	}

	return time.Duration(sec) * time.Second
}
