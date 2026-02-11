package product

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Get(c *fiber.Ctx) error {
	products, err := h.Uc.GetProducts(c.Context())
	if err != nil {
		h.logger.Error("GetProducts error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{})
	}

	h.logger.Info("GetProducts", zap.Any("products", products))
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"products": products})
}
