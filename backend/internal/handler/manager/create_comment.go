package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) CreateApplicationComment(c *fiber.Ctx) error {
	req := new(domain.CreateApplicationCommentRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid request body", nil)
	}

	if strings.TrimSpace(req.Comment) == "" {
		return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", "comment is required", map[string]string{
			"comment": "cannot be empty",
		})
	}

	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "authentication required", nil)
	}
	managerID, ok := userIDVal.(int32)
	if !ok || managerID < 1 {
		return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "invalid user id", nil)
	}

	appIDStr := c.Params("id")
	appID, err := strconv.Atoi(appIDStr)
	if err != nil || appID < 1 {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid application id", nil)
	}

	resp, err := h.Uc.CreateApplicationComment(c.Context(), int32(appID), managerID, req.Comment)
	if err != nil {
		h.logger.Error("CreateApplicationComment error", zap.Error(err))
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", "manager not found", nil)
		case errors.Is(err, custom_errors.ErrUnprocessable):
			return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", "comment is required", nil)
		default:
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "internal server error", nil)
		}
	}

	h.logger.Info("Application comment created", zap.Int32("manager_id", managerID), zap.Int32("application_id", int32(appID)))
	return c.Status(fiber.StatusCreated).JSON(resp)
}
