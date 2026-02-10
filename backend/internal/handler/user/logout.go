package user

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Logout(c *fiber.Ctx) error {
	req := new(domain.LogoutRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	err := h.Uc.Logout(c.Context(), req.RefreshToken)
	if err != nil {
		h.logger.Error("Uc.Logout error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(domain.LogoutResponse{Message: "Logged out successfully"})
}
