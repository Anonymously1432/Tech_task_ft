package main

import (
	"buggy_insurance/db"
	"buggy_insurance/internal/config"
	user_handler "buggy_insurance/internal/handler/user"
	user_repository "buggy_insurance/internal/repository/user"
	user_usecase "buggy_insurance/internal/usecase/user"

	product_handler "buggy_insurance/internal/handler/product"
	product_repository "buggy_insurance/internal/repository/product"
	product_usecase "buggy_insurance/internal/usecase/product"
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

	productRepo := product_repository.New(database)
	productUseCase := product_usecase.NewUseCase(logger, productRepo)
	productHandler := product_handler.NewHandler(logger, productUseCase)

	auth := api.Group("/auth")
	user_handler.RegisterRoutes(auth, userHandler)

	products := api.Group("/products")
	product_handler.RegisterRoutes(products, productHandler)

	serverPort := os.Getenv("API_PORT")
	if serverPort == "" {
		log.Fatal("environment variable SERVER_PORT isn't set")
	}

	log.Fatal(app.Listen(":" + serverPort))
}
