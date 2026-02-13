package user

import (
	"buggy_insurance/internal/domain"

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
