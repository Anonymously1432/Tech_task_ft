package application

import (
	"buggy_insurance/internal/domain"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) Create(c *fiber.Ctx) error {
	req := new(domain.CreateApplicationRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Parse error", zap.Error(err))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	userID := c.Locals("user_id")
	if userID == nil {
		h.logger.Error("User ID isn't in context.")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID isn't in context."})
	}
	ID, _ := strconv.Atoi(userID.(string))

	application, err := h.Uc.Create(c.Context(), ID, req.Data, req.ProductType, req.ProductID, req.ManagerID)
	if err != nil {
		h.logger.Error("Create error", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}

	h.logger.Info("Create Application", zap.Any("application", application))
	return c.Status(fiber.StatusCreated).JSON(domain.CreateApplicationResponse{
		ID:              application.ID,
		Status:          application.Status,
		ProductType:     req.ProductType,
		CalculatedPrice: application.CalculatedPrice,
		CreatedAt:       application.CreatedAt.Time,
	})
}
