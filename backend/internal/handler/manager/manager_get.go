package manager

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

func (h *Handler) GetManagerApplications(c *fiber.Ctx) error {
	status := c.Query("status")
	productType := c.Query("productType")
	search := c.Query("search")

	var statusPtr, productTypePtr *string
	if status != "" {
		statusPtr = &status
	}
	if productType != "" {
		productTypePtr = &productType
	}

	var clientID *int32
	if search != "" {
		id, err := strconv.Atoi(search)
		if err == nil {
			tmp := int32(id)
			clientID = &tmp
		}
	}

	var dateFromPtr, dateToPtr *time.Time
	if v := c.Query("dateFrom"); v != "" {
		if t, err := time.Parse(time.RFC3339, v); err == nil {
			dateFromPtr = &t
		}
	}
	if v := c.Query("dateTo"); v != "" {
		if t, err := time.Parse(time.RFC3339, v); err == nil {
			dateToPtr = &t
		}
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	resp, err := h.Uc.GetManagerApplications(
		c.Context(),
		int32(page),
		int32(limit),
		int32(offset),
		statusPtr,
		productTypePtr,
		dateFromPtr,
		dateToPtr,
		clientID,
	)
	if err != nil {
		h.logger.Error("GetManagerApplications error", zap.Error(err))
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
