package utils

import (
	"buggy_insurance/internal/domain"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func SendError(c *fiber.Ctx, status int, code string, msg string, details map[string]string) error {
	return c.Status(status).JSON(domain.ErrorResponse{
		Error:   msg,
		Code:    code,
		Details: domain.Details{Field: details},
	})
}

func ValidationErrors(err error) map[string]string {
	res := make(map[string]string)

	for _, e := range err.(validator.ValidationErrors) {
		switch e.Tag() {
		case "required":
			res[e.Field()] = "обязательное поле"
		case "email":
			res[e.Field()] = "некорректный email"
		case "min":
			res[e.Field()] = "слишком короткое значение"
		case "datetime":
			res[e.Field()] = "неверный формат даты (YYYY-MM-DD)"
		default:
			res[e.Field()] = "некорректное значение"
		}
	}

	return res
}
