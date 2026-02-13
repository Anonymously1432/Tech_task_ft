package product

import (
	utils "buggy_insurance/internal/handler"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Get godoc
// @Summary      Get all products
// @Description  Retrieve a list of all available products
// @Tags         Products
// @Accept       json
// @Produce      json
// @Success      200  {object}  domain.GetProductsResponse
// @Failure      500  {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/products [get]
func (h *Handler) Get(c *fiber.Ctx) error {
	res, err := h.Uc.GetProducts(c.Context())
	if err != nil {
		h.logger.Error("GetProducts error", zap.Error(err))

		return utils.SendError(
			c,
			fiber.StatusInternalServerError,
			"INTERNAL_SERVER_ERROR",
			"internal server error",
			nil,
		)
	}

	h.logger.Info("GetProducts success", zap.Int("count", len(res.Products)))
	return c.Status(fiber.StatusOK).JSON(res)
}
