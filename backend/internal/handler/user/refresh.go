package user

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

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
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"invalid request body",
			nil,
		)
	}

	accessToken, err := h.Uc.Refresh(c.Context(), req.RefreshToken)
	if err != nil {
		h.logger.Error("Refresh token error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			return utils.SendError(
				c,
				fiber.StatusBadRequest,
				"BAD_REQUEST",
				"invalid or expired refresh token",
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

	return c.Status(fiber.StatusOK).JSON(domain.RefreshResponse{
		AccessToken: accessToken,
		ExpiresIn:   3600,
	})
}
