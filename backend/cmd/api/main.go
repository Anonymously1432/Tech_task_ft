package main

import (
	"buggy_insurance/db"
	"buggy_insurance/internal/config"
	user_handler "buggy_insurance/internal/handler/user"
	user_repository "buggy_insurance/internal/repository/user"
	user_usecase "buggy_insurance/internal/usecase/user"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
	"go.uber.org/zap"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		ExposeHeaders:    "Authorization",
		AllowCredentials: true,
	}))

	api := app.Group("/api/v1")

	// HealthCheck
	api.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
		})
	})

	// Swagger
	api.Get("/docs", swagger.HandlerDefault)

	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("cannot create zap logger: %v", err)
	}
	defer logger.Sync()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	database, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	userRepo := user_repository.New(database)
	userUseCase := user_usecase.NewUseCase(logger, userRepo)
	userHandler := user_handler.NewHandler(logger, userUseCase)

	auth := api.Group("/auth")
	user_handler.RegisterRoutes(auth, userHandler)

	serverPort := os.Getenv("API_PORT")
	if serverPort == "" {
		log.Fatal("environment variable SERVER_PORT isn't set")
	}

	log.Fatal(app.Listen(":" + serverPort))
}
