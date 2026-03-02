package manager

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/manager"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc        manager.IUseCase
	logger    *zap.Logger
	validator *validator.Validate
}

func NewHandler(log *zap.Logger, uc manager.IUseCase, validator *validator.Validate) *Handler {
	return &Handler{Uc: uc, logger: log, validator: validator}
}

func RegisterRoutes(manager fiber.Router, h *Handler) {
	manager.Use(middlewares.JWTMiddleware)
	manager.Get("/applications", h.GetManagerApplications)
	manager.Get("/applications/:id", h.GetManagerApplicationByID)
	manager.Patch("/applications/:id/status", h.UpdateApplicationStatus)
	manager.Post("/applications/:id/comments", h.CreateApplicationComment)
	manager.Get("/statistics", h.GetStatistics)
	manager.Get("/dashboard", h.GetManagerDashboard)
}
