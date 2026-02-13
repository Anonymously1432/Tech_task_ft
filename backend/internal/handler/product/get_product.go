package product

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

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
