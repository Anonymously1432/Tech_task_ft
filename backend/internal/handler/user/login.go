package user

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Login(c *fiber.Ctx) error {
	req := new(domain.LoginRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	user, accessToken, refreshToken, err := h.Uc.Login(c.Context(), req.Email, req.Password)
	if err != nil {
		h.logger.Error("Login error", zap.Error(err))
	}
	return c.Status(fiber.StatusOK).JSON(domain.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    3600,
		User: domain.FieldsForLogin{
			ID:    int(user.ID),
			Email: user.Email,
			Role:  user.Role,
		},
	})
}
