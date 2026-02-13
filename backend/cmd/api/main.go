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

	client_handler "buggy_insurance/internal/handler/client"
	client_usecase "buggy_insurance/internal/usecase/client"

	application_handler "buggy_insurance/internal/handler/application"
	application_repository "buggy_insurance/internal/repository/application"
	application_usecase "buggy_insurance/internal/usecase/application"

	policy_handler "buggy_insurance/internal/handler/policy"
	policy_repository "buggy_insurance/internal/repository/policy"
	policy_usecase "buggy_insurance/internal/usecase/policy"

	manager_handler "buggy_insurance/internal/handler/manager"
	manager_usecase "buggy_insurance/internal/usecase/manager"
	"log"
	"os"

	_ "buggy_insurance/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
	"go.uber.org/zap"
)

// @title Buggy Insurance Backend API
// @version 1
// @description Buggy Insurance backend API

// @contact.name    Alexander Rostovshchikov
// @contact.email   rostovshchikov.fortech@gmail.com

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
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
	api.Get("/docs/*", swagger.HandlerDefault)

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

	clientRepo := user_repository.New(database)
	clientUseCase := client_usecase.NewUseCase(logger, clientRepo)
	clientHandler := client_handler.NewHandler(logger, clientUseCase)

	applicationRepo := application_repository.New(database)
	applicationUseCase := application_usecase.NewUseCase(logger, applicationRepo)
	applicationHandler := application_handler.NewHandler(logger, applicationUseCase)

	policyRepo := policy_repository.New(database)
	policyUseCase := policy_usecase.NewUseCase(logger, policyRepo)
	policyHandler := policy_handler.NewHandler(logger, policyUseCase)

	managerRepo := application_repository.New(database)
	managerUseCase := manager_usecase.NewUseCase(logger, managerRepo)
	managerHandler := manager_handler.NewHandler(logger, managerUseCase)

	manager := api.Group("/manager")
	manager_handler.RegisterRoutes(manager, managerHandler)

	auth := api.Group("/auth")
	user_handler.RegisterRoutes(auth, userHandler)

	products := api.Group("/products")
	product_handler.RegisterRoutes(products, productHandler)

	users := api.Group("/users")
	client_handler.RegisterRoutes(users, clientHandler)

	applications := api.Group("/applications")
	application_handler.RegisterRoutes(applications, applicationHandler)

	policies := api.Group("/policies")
	policy_handler.RegisterRoutes(policies, policyHandler)

	serverPort := os.Getenv("API_PORT")
	if serverPort == "" {
		log.Fatal("environment variable SERVER_PORT isn't set")
	}

	log.Fatal(app.Listen(":" + serverPort))
}
