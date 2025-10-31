package middleware

import "github.com/gin-gonic/gin"

func SetupRecovery(router *gin.Engine) {
	router.Use(gin.Recovery())
}
