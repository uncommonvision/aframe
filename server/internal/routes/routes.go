package routes

import (
	"aframe/server/internal/handlers"
	wsHandlers "aframe/server/internal/handlers/websocket"
	"aframe/server/internal/middleware"
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
