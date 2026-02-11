package product

import (
	"buggy_insurance/internal/usecase/product"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc     product.IUseCase
	logger *zap.Logger
}

func NewHandler(log *zap.Logger, uc product.IUseCase) *Handler {
	return &Handler{Uc: uc, logger: log}
}

func RegisterRoutes(product fiber.Router, h *Handler) {
	product.Get("/", h.Get)
	product.Get("/:type", h.GetProduct)
}
