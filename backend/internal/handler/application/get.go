package application

import (
	"buggy_insurance/internal/errors"
	"buggy_insurance/internal/handler"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Get GetApplications godoc
// @Summary      Get applications list
// @Description  Retrieve a paginated list of applications for the authenticated user
// @Tags         Applications
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string  true  "Bearer {accessToken}"
// @Param        status         query     string  false "Filter by status"
// @Param        page           query     int     false "Page number" default(1)
// @Param        limit          query     int     false "Items per page" default(10)
// @Success      200  {object}  domain.GetApplicationsResponse
// @Failure      400  {object}  domain.ErrorResponse  "Bad Request — invalid parameters"
// @Failure      401  {object}  domain.ErrorResponse  "Unauthorized — user not logged in"
// @Failure      404  {object}  domain.ErrorResponse  "Not Found — resource not found"
// @Failure      422  {object}  domain.ErrorResponse  "Unprocessable Entity — validation error"
// @Failure      500  {object}  domain.ErrorResponse  "Internal Server Error"
// @Router       /api/v1/applications [get]
func (h *Handler) Get(c *fiber.Ctx) error {
	userIDVal := c.Locals("user_id")
	if userIDVal == nil {
		h.logger.Error("User ID isn't in context.")
		return utils.SendError(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "User ID isn't in context", nil)
	}
	ID, err := strconv.Atoi(userIDVal.(string))
	if err != nil {
		h.logger.Error("Invalid user ID", zap.Error(err))
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid user ID", nil)
	}

	status := c.Query("status", "")
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
		h.logger.Error("GetApplications error", zap.Error(err))

		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", err.Error(), nil)
		case errors.Is(err, custom_errors.ErrValidation):
			return utils.SendError(c, 422, "UNPROCESSABLE_ENTITY", err.Error(), nil)
		default:
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", err.Error(), nil)
		}
	}

	h.logger.Info("GetApplications success", zap.Any("applications", applications))
	return c.Status(fiber.StatusOK).JSON(applications)
}
