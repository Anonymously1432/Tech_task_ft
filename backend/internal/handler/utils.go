package utils

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
)

func SendError(c *fiber.Ctx, status int, code string, msg string, details map[string]string) error {
	return c.Status(status).JSON(domain.ErrorResponse{
		Error:   msg,
		Code:    code,
		Details: domain.Details{Field: details},
	})
}
