package routes

import (
	"aframe/api/internal/handlers"
	wsHandlers "aframe/api/internal/handlers/websocket"
	"aframe/api/internal/middleware"
	"github.com/gin-gonic/gin"
)

func Setup(router *gin.Engine) {
	middleware.SetupLogger(router)
	middleware.SetupRecovery(router)
	middleware.SetupCORS(router)

	router.GET("/health", handlers.HealthCheck)

	api := router.Group("api/v1")
	{
		api.GET("/ws/:id", wsHandlers.HandleWebSocket)
	}
}
