package policy

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetPolicies(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"authentication required",
			nil,
		)
	}

	ID, err := strconv.Atoi(fmt.Sprintf("%v", userID))
	if err != nil || ID < 1 {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"invalid user id",
			nil,
		)
	}

	status := c.Query("status")

	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil || page < 1 {
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"invalid page parameter",
			map[string]string{"page": "must be >= 1"},
		)
	}

	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil || limit < 1 {
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"invalid limit parameter",
			map[string]string{"limit": "must be >= 1"},
		)
	}

	offset := (page - 1) * limit

	resp, err := h.Uc.GetPolicies(
		c.Context(),
		int32(ID),
		int32(page),
		int32(limit),
		int32(offset),
		status,
	)
	if err != nil {
		h.logger.Error("GetPolicies error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrUnauthorized):
			return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", err.Error(), nil)

		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", err.Error(), nil)

		case errors.Is(err, custom_errors.ErrBadRequest):
			return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error(), nil)

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

	return c.Status(fiber.StatusOK).JSON(resp)
}
