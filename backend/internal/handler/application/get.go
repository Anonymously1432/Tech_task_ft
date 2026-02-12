package application

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Get(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		h.logger.Error("User ID isn't in context.")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID isn't in context."})
	}
	ID, _ := strconv.Atoi(userID.(string))

	status := c.Query("status", "NEW")
	pageStr := c.Query("page", "1")
	limitStr := c.Query("limit", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	applications, err := h.Uc.Get(c.Context(), int32(ID), int32(page), int32(limit), int32(offset), status)
	if err != nil {
		h.logger.Info("GetApplications error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	h.logger.Info("GetApplications success", zap.Any("applications", applications))
	return c.Status(fiber.StatusOK).JSON(applications)
}
