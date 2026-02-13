package utils

import "github.com/gofiber/fiber/v2"

func SendError(c *fiber.Ctx, status int, code string, msg string, details map[string]string) error {
	return c.Status(status).JSON(fiber.Map{
		"error":   msg,
		"code":    code,
		"details": details,
	})
}
