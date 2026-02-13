package user

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Refresh godoc
// @Summary      Refresh access token
// @Description  Refresh JWT access token using a valid refresh token
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request  body   domain.RefreshRequest  true  "Refresh token request"
// @Success      200   {object}  domain.RefreshResponse
// @Failure      400   {object}  domain.ErrorResponse  "Invalid request body"
// @Failure      500   {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/auth/refresh [post]
func (h *Handler) Refresh(c *fiber.Ctx) error {
	req := new(domain.RefreshRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	accessToken, err := h.Uc.Refresh(c.Context(), req.RefreshToken)
	if err != nil {
		h.logger.Error("Error refreshing access token", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(domain.RefreshResponse{
		AccessToken: accessToken,
		ExpiresIn:   3600,
	})
}
