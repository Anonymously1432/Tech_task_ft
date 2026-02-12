package policy

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/policy"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     policy.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc policy.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(policies fiber.Router, h *Handler) {
	policies.Use(middlewares.JWTMiddleware)
	policies.Get("/", h.GetPolicies)
}
