package product

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetProduct(c *fiber.Ctx) error {
	productType := c.Params("type")
	if productType == "" {
		h.logger.Error("productType is empty")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "product type is required",
		})
	}
	res, err := h.Uc.GetProduct(c.Context(), productType)
	if err != nil {
		h.logger.Error("GetProduct error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	h.logger.Info("GetProduct", zap.Any("product", res))
	return c.Status(fiber.StatusOK).JSON(res)
}
