package user

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

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
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"invalid request body",
			nil,
		)
	}

	if err := h.Uc.Logout(c.Context(), req.RefreshToken); err != nil {
		h.logger.Error("Logout error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			return utils.SendError(
				c,
				fiber.StatusBadRequest,
				"BAD_REQUEST",
				"refresh token is required",
				nil,
			)

		default:
			return utils.SendError(
				c,
				fiber.StatusInternalServerError,
				"INTERNAL_SERVER_ERROR",
				"internal server error",
				nil,
			)
		}
	}

	return c.Status(fiber.StatusOK).JSON(domain.LogoutResponse{
		Message: "Logged out successfully",
	})
}
