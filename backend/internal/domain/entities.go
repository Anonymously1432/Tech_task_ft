package domain

import (
	"encoding/json"
	"time"
)

var (
	AutoFormFields = []FormField{
		{
			Name:     "brand",
			Type:     "select",
			Label:    "Марка автомобиля",
			Required: true,
			Options:  []string{"Toyota", "Honda", "BMW", "Mercedes"},
		},
		{
			Name:      "model",
			Type:      "select",
			Label:     "Модель",
			Required:  true,
			DependsOn: "brand",
		},
		{
			Name:     "year",
			Type:     "number",
			Label:    "Год выпуска",
			Required: true,
			Max:      uint(time.Now().Year()),
		},
		{
			Name:      "vin",
			Type:      "text",
			Label:     "VIN",
			Required:  true,
			MinLength: 17,
			MaxLength: 17,
		},
		{
			Name:     "plateNumber",
			Type:     "text",
			Label:    "Госномер",
			Required: true,
			Pattern:  "^[A-ZА-Я]{1}[0-9]{3}[A-ZА-Я]{2}[0-9]{2,3}$",
		},
		{
			Name:     "insuranceType",
			Type:     "radio",
			Label:    "Тип страхования",
			Required: true,
			Options:  []string{"ОСАГО", "КАСКО", "Обе"},
		},
		{
			Name:     "drivingExperience",
			Type:     "number",
			Label:    "Водительский стаж (лет)",
			Required: true,
			Min:      0,
			Max:      60,
		},
	}

	HomeFormFields = []FormField{
		{
			Name:     "propertyType",
			Type:     "radio",
			Label:    "Тип жилья",
			Required: true,
			Options:  []string{"Квартира", "Дом"},
		},
		{
			Name:     "address",
			Type:     "text",
			Label:    "Адрес",
			Required: true,
		},
		{
			Name:     "area",
			Type:     "number",
			Label:    "Площадь (м²)",
			Required: true,
			Min:      10,
			Max:      1000,
		},
		{
			Name:      "floor",
			Type:      "number",
			Label:     "Этаж",
			Required:  false,
			VisibleIf: map[string]string{"propertyType": "apartment"},
		},
		{
			Name:     "buildYear",
			Type:     "number",
			Label:    "Год постройки",
			Required: true,
			Min:      1800,
			Max:      uint(time.Now().Year()),
		},
		{
			Name:     "coverageAmount",
			Type:     "number",
			Label:    "Сумма покрытия (₽)",
			Required: true,
		},
	}

	LifeFormFields = []FormField{
		{
			Name:     "age",
			Type:     "number",
			Label:    "Возраст застрахованного",
			Required: true,
			Min:      18,
			Max:      70,
		},
		{
			Name:     "gender",
			Type:     "radio",
			Label:    "Пол",
			Required: true,
			Options:  []string{"Мужской", "Женский"},
		},
		{
			Name:     "smoking",
			Type:     "checkbox",
			Label:    "Курение",
			Required: false,
		},
		{
			Name:     "chronicDiseases",
			Type:     "checkbox",
			Label:    "Хронические заболевания",
			Required: false,
		},
		{
			Name:     "coverageAmount",
			Type:     "number",
			Label:    "Сумма покрытия (₽)",
			Required: true,
		},
		{
			Name:     "termYears",
			Type:     "select",
			Label:    "Срок страхования",
			Required: true,
			Options:  []string{"1", "3", "5", "10"},
		},
	}

	HealthFormFields = []FormField{
		{
			Name:     "age",
			Type:     "number",
			Label:    "Возраст",
			Required: true,
			Min:      0,
			Max:      100,
		},
		{
			Name:     "program",
			Type:     "select",
			Label:    "Программа",
			Required: true,
			Options:  []string{"Базовая", "Расширенная", "Премиум"},
		},
		{
			Name:     "dentistry",
			Type:     "checkbox",
			Label:    "Стоматология",
			Required: false,
		},
		{
			Name:     "hospitalization",
			Type:     "checkbox",
			Label:    "Госпитализация",
			Required: false,
		},
		{
			Name:     "chronicDiseases",
			Type:     "textarea",
			Label:    "Хронические заболевания",
			Required: false,
		},
	}

	TravelFormFields = []FormField{
		{
			Name:     "country",
			Type:     "select",
			Label:    "Страна / регион",
			Required: true,
		},
		{
			Name:     "startDate",
			Type:     "date",
			Label:    "Дата начала",
			Required: true,
		},
		{
			Name:     "endDate",
			Type:     "date",
			Label:    "Дата окончания",
			Required: true,
		},
		{
			Name:     "travelers",
			Type:     "number",
			Label:    "Количество человек",
			Required: true,
			Min:      1,
			Max:      10,
		},
		{
			Name:     "activeLeisure",
			Type:     "checkbox",
			Label:    "Активный отдых",
			Required: false,
		},
		{
			Name:     "coverageAmount",
			Type:     "select",
			Label:    "Сумма покрытия (€)",
			Required: true,
			Options:  []string{"30 000", "50 000", "100 000"},
		},
	}

	ProductFormFields = map[string][]FormField{
		"AUTO":   AutoFormFields,
		"HOME":   HomeFormFields,
		"TRAVEL": TravelFormFields,
		"LIFE":   LifeFormFields,
		"HEALTH": HealthFormFields,
	}
)

type RegisterRequest struct {
	Email     string `json:"email" example:"1@mail.ru" validate:"required"`
	Password  string `json:"password" example:"passwd" validate:"required"`
	FullName  string `json:"fullName" example:"Ivanov Ivan Ivanovich" validate:"required"`
	Phone     string `json:"phone" example:"777777777777" validate:"required"`
	BirthDate string `json:"birthDate" example:"1990-01-01" validate:"required"`
}

type RegisterResponse struct {
	Id       int    `json:"id" example:"1"`
	Email    string `json:"email" example:"1@mail.ru"`
	FullName string `json:"fullName" example:"Ivanov Ivan Ivanovich"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken  string         `json:"accessToken"`
	RefreshToken string         `json:"refreshToken"`
	ExpiresIn    int            `json:"expiresIn"`
	User         FieldsForLogin `json:"user"`
}

type FieldsForLogin struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type RefreshResponse struct {
	AccessToken string `json:"accessToken"`
	ExpiresIn   int    `json:"expiresIn"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type LogoutResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error   string  `json:"error"`
	Code    string  `json:"code"`
	Details Details `json:"details"`
}

type FormField struct {
	Name     string `json:"name"`
	Type     string `json:"type"`
	Label    string `json:"label"`
	Required bool   `json:"required"`

	Options []string `json:"options,omitempty"`

	Min uint `json:"min,omitempty"`
	Max uint `json:"max,omitempty"`

	MinLength uint   `json:"minLength,omitempty"`
	MaxLength uint   `json:"maxLength,omitempty"`
	Pattern   string `json:"pattern,omitempty"`

	MinDate string `json:"minDate,omitempty"`
	MaxDate string `json:"maxDate,omitempty"`
	After   string `json:"after,omitempty"`

	DependsOn string            `json:"dependsOn,omitempty"`
	VisibleIf map[string]string `json:"visibleIf,omitempty"`

	AffectsPrice bool `json:"affectsPrice,omitempty"`
}

type Details struct {
	Field map[string]string `json:"field"`
}

type ProductResponse struct {
	Products   []Product   `json:"products"`
	FormFields []FormField `json:"formFields"`
}

type Product struct {
	ID          int    `json:"id"`
	Type        string `json:"type"`
	Name        string `json:"name"`
	Description string `json:"description"`
	BasePrice   int    `json:"basePrice"`
}

type GetUserResponse struct {
	ID           int32     `json:"id"`
	Email        string    `json:"email"`
	FullName     string    `json:"fullName"`
	Phone        *string   `json:"phone"`
	BirthDate    time.Time `json:"birthDate"`
	Address      *string   `json:"address"`
	Role         string    `json:"role"`
	HashPassword string    `json:"password_hash,omitempty"`
}

type UpdateUserRequest struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Address  string `json:"address"`
}

type CreateApplicationRequest struct {
	ProductType string `json:"productType"`
	ProductID   int32  `json:"productId"`
	ManagerID   int32  `json:"managerId"`
	Data        string `json:"data"`
}

type Application struct {
	ID              int32     `json:"id"`
	Status          string    `json:"status"`
	ProductType     string    `json:"productType"`
	CalculatedPrice int       `json:"calculatedPrice"`
	CreatedAt       time.Time `json:"createdAt"`
}

type GetApplicationsResponse struct {
	Applications []Application `json:"applications"`
	Pagination   Pagination    `json:"pagination"`
}

type Pagination struct {
	Page  int32 `json:"page"`
	Limit int32 `json:"limit"`
	Total int32 `json:"total"`
}

type ApplicationDetail struct {
	ID              int32               `json:"id"`
	ProductType     string              `json:"productType"`
	Status          string              `json:"status"`
	Data            json.RawMessage     `json:"data"`
	CalculatedPrice int                 `json:"calculatedPrice"`
	CreatedAt       time.Time           `json:"createdAt"`
	StatusHistory   []ApplicationStatus `json:"statusHistory"`
}

type ApplicationStatus struct {
	OldStatus string    `json:"oldStatus,omitempty"`
	NewStatus string    `json:"newStatus"`
	ChangedBy int64     `json:"changedBy,omitempty"`
	Comment   string    `json:"comment,omitempty"`
	ChangedAt time.Time `json:"changedAt"`
}

type GetPoliciesResponse struct {
	Policies   []Policy   `json:"policies"`
	Pagination Pagination `json:"pagination"`
}

type Policy struct {
	ID             int32     `json:"id"`
	PolicyNumber   string    `json:"policyNumber"`
	ProductType    string    `json:"productType"`
	Status         string    `json:"status"`
	StartDate      time.Time `json:"startDate"`
	EndDate        time.Time `json:"endDate"`
	CoverageAmount int       `json:"coverageAmount"`
	Premium        int       `json:"premium"`
}

type GetManagerApplicationsResponse struct {
	Applications []ManagerApplication `json:"applications"`
	Pagination   Pagination           `json:"pagination"`
}

type ManagerApplication struct {
	ID int32 `json:"id"`

	Client ClientShort `json:"client"`

	ProductType     string    `json:"productType"`
	Status          string    `json:"status"`
	CalculatedPrice int       `json:"calculatedPrice"`
	CreatedAt       time.Time `json:"createdAt"`
}

type ClientShort struct {
	ID       int32  `json:"id"`
	FullName string `json:"fullName"`
	Email    string `json:"email"`
}

type ManagerApplicationDetail struct {
	ID int32 `json:"id"`

	Client ClientFull `json:"client"`

	ProductType     string          `json:"productType"`
	Status          string          `json:"status"`
	Data            json.RawMessage `json:"data"`
	CalculatedPrice int             `json:"calculatedPrice"`
	CreatedAt       time.Time       `json:"createdAt"`

	StatusHistory []ApplicationStatusHistory `json:"statusHistory"`
	Comments      []ApplicationComment       `json:"comments"`
}

type ClientFull struct {
	ID       int32  `json:"id"`
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

type ApplicationStatusHistory struct {
	OldStatus string    `json:"oldStatus,omitempty"`
	NewStatus string    `json:"newStatus"`
	ChangedBy int64     `json:"changedBy,omitempty"`
	Comment   string    `json:"comment,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

type ApplicationComment struct {
	ID        int32     `json:"id"`
	AuthorID  int32     `json:"authorId"`
	Author    string    `json:"author"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"createdAt"`
}

type UpdateApplicationStatusRequest struct {
	Status          string  `json:"status" validate:"required"`
	Comment         string  `json:"comment"`
	RejectionReason *string `json:"rejectionReason"`
}

type UpdateApplicationStatusResponse struct {
	ID        int64     `json:"id"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type CreateApplicationCommentRequest struct {
	Comment string `json:"comment"`
}

type CreateApplicationCommentResponse struct {
	ID        int32         `json:"id"`
	Comment   string        `json:"comment"`
	CreatedAt time.Time     `json:"createdAt"`
	Author    CommentAuthor `json:"author"`
}

type CommentAuthor struct {
	ID       int32  `json:"id"`
	FullName string `json:"fullName"`
}

type ManagerStatisticsResponse struct {
	Period     string           `json:"period"`
	ByType     map[string]int32 `json:"byType"`
	ByStatus   map[string]int32 `json:"byStatus"`
	Conversion ConversionStats  `json:"conversion"`
}

type ConversionStats struct {
	Total    int32   `json:"total"`
	Approved int32   `json:"approved"`
	Rejected int32   `json:"rejected"`
	Rate     float64 `json:"rate"`
}

type DashboardResponse struct {
	User           DashboardUser   `json:"user"`
	Stats          DashboardStats  `json:"stats"`
	RecentActivity []ActivityEntry `json:"recentActivity"`
}

type DashboardUser struct {
	FullName string `json:"fullName"`
}

type DashboardStats struct {
	ActivePolicies      int64   `json:"activePolicies"`
	TotalCoverage       float64 `json:"totalCoverage"`
	PendingApplications int64   `json:"pendingApplications"`
}

type ActivityEntry struct {
	ID              int32     `json:"id"`
	Type            string    `json:"type"`
	Status          string    `json:"status"`
	CreatedAt       time.Time `json:"createdAt"`
	ProductType     string    `json:"productType"`
	CalculatedPrice int64     `json:"calculatedPrice,omitempty"`
}

type ManagerDashboardResponse struct {
	Stats              ManagerDashboardStats    `json:"stats"`
	ChartData          []ChartDataEntry         `json:"chartData"`
	RecentApplications []RecentApplicationEntry `json:"recentApplications"`
}

type ManagerDashboardStats struct {
	NewToday          int64 `json:"newToday"`
	UnderReview       int64 `json:"underReview"`
	ApprovedThisMonth int64 `json:"approvedThisMonth"`
	RejectedThisMonth int64 `json:"rejectedThisMonth"`
}

type ChartDataEntry struct {
	Date     time.Time `json:"date"`
	New      int64     `json:"new"`
	Approved int64     `json:"approved"`
	Rejected int64     `json:"rejected"`
}

type RecentApplicationEntry struct {
	ID              int32     `json:"id"`
	ClientID        int32     `json:"clientId"`
	ClientFullName  string    `json:"clientFullName"`
	ProductType     string    `json:"productType"`
	Status          string    `json:"status"`
	CalculatedPrice int64     `json:"calculatedPrice"`
	CreatedAt       time.Time `json:"createdAt"`
}

type GetProductsResponse struct {
	Products []Product `json:"products"`
}
