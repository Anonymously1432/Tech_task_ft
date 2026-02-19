package manager

import (
	utils "buggy_insurance/internal/handler"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetManagerDashboard godoc
// @Summary      Get manager dashboard
// @Description  Retrieve overview stats for the manager
// @Tags         Manager
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Success      200  {object}  domain.ManagerDashboardResponse
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      500  {object}  domain.ErrorResponse  "Failed to retrieve dashboard"
// @Router       /api/v1/manager/dashboard [get]
func (h *Handler) GetManagerDashboard(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"authentication required",
			nil,
		)
	}

	id, err := strconv.Atoi(fmt.Sprintf("%v", userID))
	if err != nil || id < 1 {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"invalid user id",
			nil,
		)
	}

	resp, err := h.Uc.GetManagerDashboard(c.Context())
	if err != nil {
		h.logger.Error("GetManagerDashboard error", zap.Error(err))
		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to get manager dashboard", nil)
	}

	h.logger.Info("Manager dashboard retrieved")
	return c.Status(fiber.StatusOK).JSON(resp)
}
