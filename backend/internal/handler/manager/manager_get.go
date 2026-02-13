package manager

import (
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
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
		if err != nil {
			return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid client id in search", map[string]string{"search": "must be a number"})
		}
		tmp := int32(id)
		clientID = &tmp
	}

	var dateFromPtr, dateToPtr *time.Time
	if v := c.Query("dateFrom"); v != "" {
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid dateFrom format", map[string]string{"dateFrom": "must be RFC3339"})
		}
		dateFromPtr = &t
	}
	if v := c.Query("dateTo"); v != "" {
		t, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid dateTo format", map[string]string{"dateTo": "must be RFC3339"})
		}
		dateToPtr = &t
	}

	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(c.Query("limit", "10"))
	if err != nil || limit < 1 {
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
		if errors.Is(err, custom_errors.ErrInternal) {
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "failed to fetch manager applications", nil)
		}
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error(), nil)
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}
