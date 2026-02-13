package manager

import (
	"buggy_insurance/internal/domain"
	"buggy_insurance/internal/handler/application"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) CreateApplicationComment(c *fiber.Ctx) error {
	req := new(domain.CreateApplicationCommentRequest)
	userID := c.Locals("user_id")
	if userID == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	managerID := userID.(int32)

	appIDStr := c.Params("id")
	appID, err := strconv.Atoi(appIDStr)
	if err != nil || appID < 1 {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	if err = c.BodyParser(&req); err != nil || strings.TrimSpace(req.Comment) == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "comment is required"})
	}

	resp, err := h.Uc.CreateApplicationComment(c.Context(), int32(appID), managerID, req.Comment)
	if err != nil {
		h.logger.Error("CreateApplicationComment error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(resp)
}
