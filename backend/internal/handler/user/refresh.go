package user

import "github.com/gofiber/fiber/v2"

func (h *Handler) Refresh(c *fiber.Ctx) error {
	_ = h.Uc.Refresh(c.Context())
	return nil
}
