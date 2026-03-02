package user

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/user"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc        user.IUseCase
	logger    *zap.Logger
	validator *validator.Validate
}

func NewHandler(log *zap.Logger, uc user.IUseCase, validator *validator.Validate) *Handler {
	return &Handler{Uc: uc, logger: log, validator: validator}
}

func RegisterRoutes(auth fiber.Router, h *Handler) {
	auth.Post("/register", h.Register)
	auth.Post("/login", h.Login)
	auth.Post("/refresh", h.Refresh)

	auth.Use(middlewares.JWTMiddleware)
	auth.Post("/logout", h.Logout)
}
