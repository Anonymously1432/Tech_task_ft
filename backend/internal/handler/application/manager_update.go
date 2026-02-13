package application

import (
	"buggy_insurance/internal/domain"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) UpdateApplicationStatus(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	applicationID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	var req domain.UpdateApplicationStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return c.SendStatus(fiber.StatusBadRequest)
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
