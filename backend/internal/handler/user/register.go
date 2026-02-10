package user

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Register(c *fiber.Ctx) error {
	req := new(domain.RegisterRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	user, err := h.Uc.Register(c.Context(), req.Email, req.Password, req.FullName, req.Phone, req.BirthDate)
	if err != nil {
		h.logger.Error("Uc.Register error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	h.logger.Info("Register success", zap.String("email", user.Email))
	return c.Status(fiber.StatusCreated).JSON(user)
}
