package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment string
	Host        string
	Port        string
	LogLevel    string
}

func Load() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Environment: getEnv("ENVIRONMENT", "development"),
		Host:        getEnv("HOST", "localhost"),
		Port:        getEnv("PORT", "8080"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
	}

	log.Printf("Configuration loaded: environment=%s host=%s port=%s", cfg.Environment, cfg.Host, cfg.Port)
	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
