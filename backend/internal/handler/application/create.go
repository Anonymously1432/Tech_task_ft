package application

import (
	"buggy_insurance/internal/domain"
	"buggy_insurance/internal/errors"
	"buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Create(c *fiber.Ctx) error {
	req := new(domain.CreateApplicationRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Parse error", zap.Error(err))
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body", nil)
	}

	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		h.logger.Error("User ID isn't in context.")
		return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "User ID isn't in context", nil)
	}
	ID, _ := strconv.Atoi(userIDVal.(string))

	if req.ProductID == 0 {
		return utils.SendError(c, 422, "UNPROCESSABLE_ENTITY", "Validation failed", map[string]string{"productID": "ProductID is required"})
	}
	if req.ManagerID == 0 {
		return utils.SendError(c, 422, "UNPROCESSABLE_ENTITY", "Validation failed", map[string]string{"managerID": "ManagerID is required"})
	}

	application, err := h.Uc.Create(c.Context(), req.Data, int32(ID), req.ProductID, req.ManagerID, req.ProductType)
	if err != nil {
		h.logger.Error("Create error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", err.Error(), nil)
		case errors.Is(err, custom_errors.ErrConflict):
			return utils.SendError(c, fiber.StatusConflict, "CONFLICT", err.Error(), nil)
		case errors.Is(err, custom_errors.ErrValidation):
			return utils.SendError(c, 422, "UNPROCESSABLE_ENTITY", err.Error(), nil)
		case errors.Is(err, custom_errors.ErrUnauthorized):
			return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", err.Error(), nil)
		default:
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error(), nil)
		}
	}

	h.logger.Info("Create Application", zap.Any("application", application))
	return c.Status(fiber.StatusCreated).JSON(application)
}
