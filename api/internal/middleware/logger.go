package middleware

import "github.com/gin-gonic/gin"

func SetupLogger(router *gin.Engine) {
	router.Use(gin.Logger())
}
