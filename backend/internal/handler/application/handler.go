package application

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/application"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     application.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc application.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(users fiber.Router, h *Handler) {
	users.Use(middlewares.JWTMiddleware)
	users.Post("/", h.Create)
}
