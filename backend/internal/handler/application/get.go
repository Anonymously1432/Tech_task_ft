package application

import (
	"buggy_insurance/internal/errors"
	"buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Get(c *fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		h.logger.Error("User ID isn't in context.")
		return handler.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "User ID isn't in context", nil)
	}
	ID, err := strconv.Atoi(userIDVal.(string))
	if err != nil {
		h.logger.Error("Invalid user ID", zap.Error(err))
		return handler.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid user ID", nil)
	}

	status := c.Query("status", "")
	pageStr := c.Query("page", "1")
	limitStr := c.Query("limit", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	applications, err := h.Uc.Get(c.Context(), int32(ID), int32(page), int32(limit), int32(offset), status)
	if err != nil {
		h.logger.Error("GetApplications error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return handler.SendError(c, fiber.StatusNotFound, "NOT_FOUND", err.Error(), nil)
		case errors.Is(err, custom_errors.ErrValidation):
			return handler.SendError(c, 422, "UNPROCESSABLE_ENTITY", err.Error(), nil)
		default:
			return handler.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error(), nil)
		}
	}

	h.logger.Info("GetApplications success", zap.Any("applications", applications))
	return c.Status(fiber.StatusOK).JSON(applications)
}
