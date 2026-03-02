package policy

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/policy"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc        policy.IUseCase
	logger    *zap.Logger
	validator *validator.Validate
}

func NewHandler(log *zap.Logger, uc policy.IUseCase, validator *validator.Validate) *Handler {
	return &Handler{Uc: uc, logger: log, validator: validator}
}

func RegisterRoutes(policies fiber.Router, h *Handler) {
	policies.Use(middlewares.JWTMiddleware)
	policies.Get("/", h.GetPolicies)
}
