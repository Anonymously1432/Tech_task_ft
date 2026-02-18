package product

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// GetProduct godoc
// @Summary      Get product by type
// @Description  Retrieve details for a specific product by its type
// @Tags         Products
// @Accept       json
// @Produce      json
// @Param        type   path      string  true   "Product type"
// @Success      200    {object}  domain.ProductResponse
// @Failure      400    {object}  domain.ErrorResponse  "Bad Request — missing or invalid product type"
// @Failure      404    {object}  domain.ErrorResponse  "Not Found — product not found"
// @Failure      500    {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/products/{type} [get]
func (h *Handler) GetProduct(c *fiber.Ctx) error {
	productType := c.Params("type")
	if productType == "" {
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"product type is required",
			map[string]string{
				"type": "cannot be empty",
			},
		)
	}

	res, err := h.Uc.GetProduct(c.Context(), productType)
	if err != nil {
		h.logger.Error("GetProduct error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrBadRequest):
			return utils.SendError(
				c,
				fiber.StatusBadRequest,
				"BAD_REQUEST",
				err.Error(),
				nil,
			)

		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(
				c,
				fiber.StatusNotFound,
				"NOT_FOUND",
				"product not found",
				nil,
			)

		default:
			return utils.SendError(
				c,
				fiber.StatusInternalServerError,
				"INTERNAL_SERVER_ERROR",
				"internal server error",
				nil,
			)
		}
	}

	return c.Status(fiber.StatusOK).JSON(res)
}
