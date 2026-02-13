package manager

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetManagerApplicationByID godoc
// @Summary      Get application details
// @Description  Retrieve detailed information for a specific application
// @Tags         Manager
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Param        id             path      int     true  "Application ID"
// @Success      200  {object}  domain.ManagerApplicationDetail
// @Failure      400  {object}  domain.ErrorResponse  "Invalid application ID"
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      404  {object}  domain.ErrorResponse  "Application not found"
// @Failure      500  {object}  domain.ErrorResponse  "Failed to retrieve application"
// @Router       /api/v1/manager/applications/{id} [get]
func (h *Handler) GetManagerApplicationByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	applicationID, err := strconv.Atoi(idStr)
	if err != nil || applicationID < 1 {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid application id", map[string]string{"id": "must be a positive integer"})
	}

	resp, err := h.Uc.GetManagerApplicationByID(c.Context(), int32(applicationID))
	if err != nil {
		h.logger.Error("GetManagerApplicationByID error", zap.Error(err))
		if errors.Is(err, custom_errors.ErrNotFound) {
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", "application not found", nil)
		}
		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to fetch application details", nil)
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
