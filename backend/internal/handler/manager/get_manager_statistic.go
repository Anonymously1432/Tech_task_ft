package manager

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetStatistics(c *fiber.Ctx) error {
	period := c.Query("period", "month")

	stats, err := h.Uc.GetManagerStatistics(c.Context(), period)
	if err != nil {
		h.logger.Error("GetManagerStatistics error", zap.Error(err))

		if errors.Is(err, custom_errors.ErrValidation) {
			return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", err.Error(), map[string]string{"period": "invalid period"})
		}

		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to get manager statistics", nil)
	}

	return c.Status(fiber.StatusOK).JSON(stats)
}
