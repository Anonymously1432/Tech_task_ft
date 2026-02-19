package manager

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetStatistics godoc
// @Summary      Get manager statistics
// @Description  Retrieve application statistics by period (week, month, quarter, year)
// @Tags         Manager
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Param        period         query     string  false "Period filter: week, month, quarter, year"  default(month)
// @Success      200  {object}  domain.ManagerStatisticsResponse
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      422  {object}  domain.ErrorResponse  "Invalid period"
// @Failure      500  {object}  domain.ErrorResponse  "Failed to retrieve statistics"
// @Router       /api/v1/manager/statistics [get]
func (h *Handler) GetStatistics(c *fiber.Ctx) error {
	period := c.Query("period", "month")

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

	stats, err := h.Uc.GetManagerStatistics(c.Context(), period, int32(id))
	if err != nil {
		h.logger.Error("GetManagerStatistics error", zap.Error(err))

		if errors.Is(err, custom_errors.ErrValidation) {
			return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", err.Error(), map[string]string{"period": "invalid period"})
		}

		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to get manager statistics", nil)
	}

	return c.Status(fiber.StatusOK).JSON(stats)
}
