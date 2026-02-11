package client

import (
	"buggy_insurance/internal/domain"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) UpdateUser(c *fiber.Ctx) error {
	req := new(domain.UpdateUserRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	userID := c.Locals("user_id")
	if userID == nil {
		h.logger.Error("User ID isn't in context.")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID isn't in context."})
	}
	ID, _ := strconv.Atoi(userID.(string))
	user, err := h.Uc.UpdateUser(c.Context(), int32(ID), req.FullName, req.Email, req.Address)
	if err != nil {
		h.logger.Error("User update error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	h.logger.Info("User updated successfully", zap.Int("UserID", ID))
	return c.Status(fiber.StatusOK).JSON(user)
}
