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

// GetManagerApplications godoc
// @Summary      List manager applications
// @Description  Retrieve a paginated list of applications with filters
// @Tags         Manager
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Param        status         query     string  false "Filter by application status"
// @Param        productType    query     string  false "Filter by product type"
// @Param        search         query     string  false "Search by client ID"
// @Param        dateFrom       query     string  false "Start date filter (RFC3339)"
// @Param        dateTo         query     string  false "End date filter (RFC3339)"
// @Param        page           query     int     false "Page number"  default(1)
// @Param        limit          query     int     false "Page size"  default(10)
// @Success      200  {object}  domain.GetManagerApplicationsResponse
// @Failure      400  {object}  domain.ErrorResponse  "Invalid query parameters"
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      500  {object}  domain.ErrorResponse  "Internal server error"
// @Router       /api/v1/manager/applications [get]
func (h *Handler) GetManagerApplications(c *fiber.Ctx) error {
	time.Sleep(7 * time.Second)
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
