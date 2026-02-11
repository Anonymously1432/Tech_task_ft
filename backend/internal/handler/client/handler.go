package client

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/client"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     client.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc client.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(users fiber.Router, h *Handler) {
	users.Use(middlewares.JWTMiddleware)
	users.Get("/me", h.GetUser)
	users.Put("/me", h.UpdateUser)
}
