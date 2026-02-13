package manager

import (
	utils "buggy_insurance/internal/handler"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetManagerDashboard(c *fiber.Ctx) error {
	resp, err := h.Uc.GetManagerDashboard(c.Context())
	if err != nil {
		h.logger.Error("GetManagerDashboard error", zap.Error(err))
		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to get manager dashboard", nil)
	}

	h.logger.Info("Manager dashboard retrieved")
	return c.Status(fiber.StatusOK).JSON(resp)
}
