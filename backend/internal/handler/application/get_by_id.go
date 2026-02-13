package application

import (
	"buggy_insurance/internal/errors"
	"buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		return handler.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid application ID", map[string]string{"id": "Must be a positive integer"})
	}

	appDetail, err := h.Uc.GetByID(c.Context(), int32(id))
	if err != nil {
		h.logger.Error("GetApplicationByID error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return handler.SendError(c, fiber.StatusNotFound, "NOT_FOUND", "Application not found", nil)
		case errors.Is(err, custom_errors.ErrValidation):
			return handler.SendError(c, 422, "UNPROCESSABLE_ENTITY", err.Error(), nil)
		default:
			return handler.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Internal server error", nil)
		}
	}

	return c.Status(fiber.StatusOK).JSON(appDetail)
}
