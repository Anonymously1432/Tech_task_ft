package user

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Register godoc
// @Summary      Register a new user
// @Description  Create a new user account
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request  body      domain.RegisterRequest  true  "User registration data"
// @Success      201   {object}  domain.RegisterResponse
// @Failure      400   {object}  domain.ErrorResponse  "Invalid request body"
// @Failure      500   {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/auth/register [post]
func (h *Handler) Register(c *fiber.Ctx) error {
	req := new(domain.RegisterRequest)
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

	birthDate, err := time.Parse("2006-01-02", req.BirthDate)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid birth_date format")
	}

	user, err := h.Uc.Register(
		c.Context(),
		req.Email,
		req.Password,
		req.FullName,
		req.Phone,
		birthDate,
	)
	if err != nil {
		h.logger.Error("Uc.Register error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			return utils.SendError(
				c,
				fiber.StatusBadRequest,
				"BAD_REQUEST",
				err.Error(),
				nil,
			)
		case errors.Is(err, custom_errors.ErrConflict):
			return utils.SendError(
				c,
				fiber.StatusConflict,
				"CONFLICT",
				"email already exists",
				map[string]string{"email": req.Email},
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

	h.logger.Info("Register success", zap.String("email", user.Email))
	return c.Status(fiber.StatusCreated).JSON(user)
}
