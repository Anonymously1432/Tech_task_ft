package client

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) UpdateUser(c *fiber.Ctx) error {
	req := new(domain.UpdateUserRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return utils.SendError(
			c,
			fiber.StatusBadRequest,
			"BAD_REQUEST",
			"invalid request body",
			nil,
		)
	}

	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"authentication required",
			nil,
		)
	}

	id, err := strconv.Atoi(fmt.Sprintf("%v", userIDVal))
	if err != nil || id < 1 {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"invalid user id",
			nil,
		)
	}

	user, err := h.Uc.UpdateUser(c.Context(), int32(id), req.FullName, req.Email, req.Address)
	if err != nil {
		h.logger.Error("User update error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrConflict):
			return utils.SendError(
				c,
				fiber.StatusConflict,
				"CONFLICT",
				"email already exists",
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

	h.logger.Info("User updated successfully", zap.Int("user_id", id))
	return c.Status(fiber.StatusOK).JSON(user)
}
