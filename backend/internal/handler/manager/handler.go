package manager

import (
	"buggy_insurance/internal/middlewares"
	"buggy_insurance/internal/usecase/manager"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     manager.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc manager.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(manager fiber.Router, h *Handler) {
	manager.Use(middlewares.JWTMiddleware)
	manager.Get("/applications", h.GetManagerApplications)
	manager.Get("/applications/:id", h.GetManagerApplicationByID)
	manager.Patch("/applications/:id/status", h.UpdateApplicationStatus)
	manager.Post("/applications/:id/comments", h.CreateApplicationComment)
	manager.Get("/statistics", h.GetStatistics)
	manager.Get("/dashboard", h.GetDashboard)
}
