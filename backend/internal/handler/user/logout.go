package user

import (
	"buggy_insurance/internal/domain"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Logout godoc
// @Summary      User logout
// @Description  Invalidate refresh token to log out the user
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string                true  "Bearer {accessToken}"
// @Param        request        body      domain.LogoutRequest  true  "Logout request with refresh token"
// @Success      200            {object}  domain.LogoutResponse
// @Failure      400            {object}  domain.ErrorResponse  "Invalid request body"
// @Failure      401            {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      500            {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/auth/logout [post]
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
