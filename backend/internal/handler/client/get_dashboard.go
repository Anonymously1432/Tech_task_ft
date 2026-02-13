package client

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetDashboard(c *fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	userID := userIDVal.(int32)

	resp, err := h.Uc.GetDashboard(c.Context(), userID)
	if err != nil {
		h.logger.Error("GetDashboard error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
