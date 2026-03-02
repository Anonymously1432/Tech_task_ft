package application

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/application"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc        application.IUseCase
	logger    *zap.Logger
	validator *validator.Validate
}

func NewHandler(log *zap.Logger, uc application.IUseCase, validator *validator.Validate) *Handler {
	return &Handler{Uc: uc, logger: log, validator: validator}
}

func RegisterRoutes(applications fiber.Router, h *Handler) {
	applications.Get("/:id", h.GetByID)
	applications.Use(middlewares.JWTMiddleware)
	applications.Get("/", h.Get)
	applications.Post("/", h.Create)
}
