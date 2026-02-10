package user

import (
	user_repository "buggy_insurance/internal/repository/user"
	"context"
	"os"
	"strconv"
	"time"

	"go.uber.org/zap"
)

type IUseCase interface {
	Register(
		ctx context.Context,
		email, password, fullName, phone string, birthDate time.Time,
	) (*user_repository.CreateUserRow, error)
	Login(
		ctx context.Context,
		userEmail, userPassword string,
	) (*user_repository.GetByEmailRow, string, string, error)
	Refresh(ctx context.Context, refreshToken string) (string, error)
	//WhoAmI(ctx context.Context, userID string) (*user_repository.GetByIDRow, error)
	//AddingInfo(ctx context.Context,
	//	userUUID uuid.UUID,
	//	userPhone, userReserveEmail string,
	//	userBirthDate time.Time,
	//) (*user_repository.GetUserRow, error)
	//GetUser(ctx context.Context, userUUID uuid.UUID) (*user_repository.GetUserRow, error)
	//SetAvatar(ctx context.Context, userUUID uuid.UUID, avatar *string) (*user_repository.GetUserRow, error)
}

type UseCase struct {
	logger *zap.Logger
	repo   *user_repository.Queries
	secret string
	salt   int
}

func NewUseCase(logger *zap.Logger, repo *user_repository.Queries) IUseCase {
	saltStr := os.Getenv("BCRYPT_SALT")
	if saltStr == "" {
		logger.Fatal("BCRYPT_SALT is not set")
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		logger.Fatal("JWT_SECRET is not set")
	}

	intSalt, err := strconv.Atoi(saltStr)
	if err != nil {
		logger.Fatal("BCRYPT_SALT is not a valid integer", zap.Error(err))
	}
	return &UseCase{
		logger: logger,
		repo:   repo,
		salt:   intSalt,
		secret: secret,
	}
}
