package manager

import (
	"buggy_insurance/internal/domain"
	custom_errors "buggy_insurance/internal/errors"
	utils "buggy_insurance/internal/handler"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// CreateApplicationComment godoc
// @Summary      Create a comment for an application
// @Description  Allows a manager to add a comment to a specific application
// @Tags         Manager
// @Accept       json
// @Produce      json
// @Param        Authorization  header    string                                   true   "Bearer {accessToken}"
// @Param        id             path      int                                      true   "Application ID"
// @Param        request        body      domain.CreateApplicationCommentRequest  true   "Comment payload"
// @Success      201            {object}  domain.CreateApplicationCommentResponse
// @Failure      400            {object}  domain.ErrorResponse  "Invalid application id or request body"
// @Failure      401            {object}  domain.ErrorResponse  "Unauthorized"
// @Failure      422            {object}  domain.ErrorResponse  "Comment is required"
// @Failure      404            {object}  domain.ErrorResponse  "Manager or application not found"
// @Failure      500            {object}  domain.ErrorResponse  "Internal server error"
// @Router       /api/v1/manager/applications/{id}/comments [post]
func (h *Handler) CreateApplicationComment(c *fiber.Ctx) error {
	req := new(domain.CreateApplicationCommentRequest)
	if err := c.BodyParser(req); err != nil {
		h.logger.Error("Body parsing error", zap.Error(err))
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid request body", nil)
	}

	if strings.TrimSpace(req.Comment) == "" {
		return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", "comment is required", map[string]string{
			"comment": "cannot be empty",
		})
	}

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

	id, err := strconv.Atoi(fmt.Sprintf("%v", userID))
	if err != nil || id < 1 {
		return utils.SendError(
			c,
			fiber.StatusUnauthorized,
			"UNAUTHORIZED",
			"invalid user id",
			nil,
		)
	}

	appIDStr := c.Params("id")
	appID, err := strconv.Atoi(appIDStr)
	if err != nil || appID < 1 {
		return utils.SendError(c, fiber.StatusBadRequest, "BAD_REQUEST", "invalid application id", nil)
	}

	resp, err := h.Uc.CreateApplicationComment(c.Context(), int32(appID), int32(id), req.Comment)
	if err != nil {
		h.logger.Error("CreateApplicationComment error", zap.Error(err))
		switch {
		case errors.Is(err, custom_errors.ErrNotFound):
			return utils.SendError(c, fiber.StatusNotFound, "NOT_FOUND", "manager not found", nil)
		case errors.Is(err, custom_errors.ErrUnprocessable):
			return utils.SendError(c, fiber.StatusUnprocessableEntity, "UNPROCESSABLE_ENTITY", "comment is required", nil)
		default:
			return utils.SendError(c, fiber.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "internal server error", nil)
		}
	}

	h.logger.Info("Application comment created", zap.Int32("manager_id", int32(id)), zap.Int32("application_id", int32(appID)))
	return c.Status(fiber.StatusCreated).JSON(resp)
}
