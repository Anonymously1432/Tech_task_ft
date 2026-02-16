package user

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Login godoc
// @Summary      User login
// @Description  Authenticate user and get access/refresh tokens
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request  body   domain.LoginRequest  true  "User login data"
// @Success      200   {object}  domain.LoginResponse
// @Failure      400   {object}  domain.ErrorResponse  "Invalid request body"
// @Failure      401   {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      500   {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/auth/login [post]
func (h *Handler) Login(c *fiber.Ctx) error {
	req := new(domain.LoginRequest)
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

	user, accessToken, refreshToken, err := h.Uc.Login(c.Context(), req.Email, req.Password)
	if err != nil {
		h.logger.Error("Login error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(
				c,
				fiber.StatusNotFound,
				"NOT_FOUND",
				"user not found",
				nil,
			)

		case errors.Is(err, custom_errors.ErrUnauthorized):
			return utils.SendError(
				c,
				fiber.StatusOK,
				"StatusOK",
				"invalid credentials",
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

	h.logger.Info("Login success", zap.Int32("user_id", user.ID))

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
