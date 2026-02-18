package application

import (
	"buggy_insurance/internal/errors"
	"buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetByID GetApplicationByID godoc
// @Summary      Get application by ID
// @Description  Retrieve details of a specific application by its ID
// @Tags         Applications
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Param        id             path      int     true  "Application ID"
// @Success      200  {object}  domain.ApplicationDetail
// @Failure      400  {object}  domain.ErrorResponse  "Bad Request — invalid application ID"
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized — user not logged in"
// @Failure      404  {object}  domain.ErrorResponse  "Not Found — application not found"
// @Failure      422  {object}  domain.ErrorResponse  "Unprocessable Entity — validation error"
// @Failure      500  {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/applications/{id} [get]
func (h *Handler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid application ID", map[string]string{"id": "Must be a positive integer"})
	}

	appDetail, err := h.Uc.GetByID(c.Context(), int32(id))
	if err != nil {
		h.logger.Error("GetApplicationByID error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", "Application not found", nil)
		case errors.Is(err, custom_errors.ErrValidation):
			return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", err.Error(), nil)
		default:
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Internal server error", nil)
		}
	}

	return c.Status(fiber.StatusOK).JSON(appDetail)
}
