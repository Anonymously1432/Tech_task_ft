package application

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetStatistics(c *fiber.Ctx) error {
	period := c.Query("period", "month")
	validPeriods := map[string]bool{"week": true, "month": true, "quarter": true, "year": true}
	if !validPeriods[period] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid period"})
	}

	stats, err := h.Uc.GetManagerStatistics(c.Context(), period)
	if err != nil {
		h.logger.Error("GetManagerStatistics error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(stats)
}
