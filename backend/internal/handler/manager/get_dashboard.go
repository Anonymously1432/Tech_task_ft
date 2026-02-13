package manager

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetManagerDashboard(c *fiber.Ctx) error {
	stats, err := h.Uc.GetManagerDashboard(c.Context())
	if err != nil {
		h.logger.Error("GetManagerDashboard error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(stats)
}
