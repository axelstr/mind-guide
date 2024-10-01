package logger

import (
	"fmt"
	"os"
	"time"
)

var isDebug bool

func init() {
	isDebug = os.Getenv("LOG_LEVEL") == "debug"
}

func Debug(format string, args ...interface{}) {
	if isDebug {
		log("DEBUG", format, args...)
	}
}

func Info(format string, args ...interface{}) {
	log("INFO", format, args...)
}

func Error(format string, args ...interface{}) {
	log("ERROR", format, args...)
}

func log(level, format string, args ...interface{}) {
	message := fmt.Sprintf(format, args...)
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf("[%s] %s: %s\n", timestamp, level, message)
}
