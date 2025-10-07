package routes

import (
	"github.com/gin-gonic/gin"
	"kitchenmix/server/internal/handlers"
	"kitchenmix/server/internal/middleware"
)

func Setup(router *gin.Engine) {
	middleware.SetupLogger(router)
	middleware.SetupRecovery(router)
	middleware.SetupCORS(router)

	router.GET("/health", handlers.HealthCheck)
}
