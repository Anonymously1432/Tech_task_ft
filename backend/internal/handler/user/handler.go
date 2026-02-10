package user

import (
	"buggy_insurance/internal/usecase/user"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     user.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc user.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(auth fiber.Router, h *Handler) {
	auth.Post("/register", h.Register)
	auth.Post("/login", h.Login)
	auth.Post("/refresh", h.Refresh)
	auth.Post("/logout", h.Logout)
}
