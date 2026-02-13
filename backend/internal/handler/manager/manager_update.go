package manager

import (
	"buggy_insurance/internal/domain"
	utils "buggy_insurance/internal/handler"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) UpdateApplicationStatus(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "user not authorized", nil)
	}

	applicationID, err := strconv.Atoi(c.Params("id"))
	if err != nil || applicationID < 1 {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid application id", map[string]string{"id": "must be a positive integer"})
	}

	var req domain.UpdateApplicationStatusRequest
	if err = c.BodyParser(&req); err != nil {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid request body", nil)
	}

	if req.Status == "REJECTED" && (req.RejectionReason == nil || strings.TrimSpace(*req.RejectionReason) == "") {
		return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", "rejectionReason is required for REJECTED status", map[string]string{"rejectionReason": "required when status is REJECTED"})
	}

	resp, err := h.Uc.UpdateApplicationStatus(
		c.Context(),
		int32(applicationID),
		req.Status,
		req.Comment,
		req.RejectionReason,
	)
	if err != nil {
		h.logger.Error("UpdateApplicationStatus error", zap.Error(err))
		return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error(), nil)
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
