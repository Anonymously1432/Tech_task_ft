package middlewares

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"

	"buggy_insurance/internal/helpers"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func JWTMiddleware(c *fiber.Ctx) error {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "JWT_SECRET not set",
		})
	}

	authHeader := c.Get("Authorization")
	var accessTokenString string
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			accessTokenString = parts[1]
		}
	}

	accessValid := false
	var userID string

	if accessTokenString != "" {
		token, err := jwt.Parse(accessTokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return []byte(secret), nil
		})

		if err == nil && token.Valid {
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				userID, _ = claims["sub"].(string)
				accessValid = true
			}
		}
	}

	if accessValid {
		c.Locals("user_id", userID)
		return c.Next()
	}

	refreshTokenString := c.Cookies("refresh_token")
	if refreshTokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	refreshToken, err := jwt.Parse(refreshTokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil || !refreshToken.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	if claims, ok := refreshToken.Claims.(jwt.MapClaims); ok {
		userID, _ = claims["sub"].(string)
	} else {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	userIDInt, _ := strconv.Atoi(userID)

	newAccess, newRefresh, err := helpers.GenerateTokens(int32(userIDInt))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	c.Set("Authorization", "Bearer "+newAccess)
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		Value:    newRefresh,
		HTTPOnly: true,
		Path:     "/",
	})

	c.Locals("user_id", userID)

	return c.Next()
}
