package client

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetDashboard godoc
// @Summary      Get user dashboard
// @Description  Retrieve statistics and recent activity for the currently authenticated user
// @Tags         Users
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Success      200  {object}  domain.DashboardResponse
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized — authentication required or invalid user ID"
// @Failure      404  {object}  domain.ErrorResponse  "Not Found — user not found"
// @Failure      500  {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/users/dashboard [get]
func (h *Handler) GetDashboard(c *fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"authentication required",
			nil,
		)
	}

	userID, ok := userIDVal.(int32)
	if !ok || userID < 1 {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"invalid user id",
			nil,
		)
	}

	resp, err := h.Uc.GetDashboard(c.Context(), userID)
	if err != nil {
		h.logger.Error("GetDashboard error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(
				c,
				fiber.StatusNotFound,
				"NOT_FOUND",
				"user not found",
				nil,
			)
		default:
			return utils.SendError(
				c,
				fiber.StatusInternalServerError,
				"INTERNAL_SERVER_ERROR",
				"internal server error",
				nil,
			)
		}
	}

	h.logger.Info("GetDashboard success", zap.Int32("user_id", userID))
	return c.Status(fiber.StatusOK).JSON(resp)
}
