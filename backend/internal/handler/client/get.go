package client

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetUser(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		h.logger.Error("User ID isn't in context.")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID isn't in context."})
	}
	ID, _ := strconv.Atoi(userID.(string))
	user, err := h.Uc.GetUser(c.Context(), int32(ID))
	if err != nil {
		h.logger.Error("GetUser error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	h.logger.Info("GetUser", zap.Any("user", user))
	return c.Status(fiber.StatusOK).JSON(user)
}
