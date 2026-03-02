package product

import (
	"buggy_insurance/internal/usecase/product"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type Handler struct {
	Uc        product.IUseCase
	logger    *zap.Logger
	validator *validator.Validate
}

func NewHandler(log *zap.Logger, uc product.IUseCase, validator *validator.Validate) *Handler {
	return &Handler{Uc: uc, logger: log, validator: validator}
}

func RegisterRoutes(product fiber.Router, h *Handler) {
	product.Get("/", h.Get)
	product.Get("/:type", h.GetProduct)
}
