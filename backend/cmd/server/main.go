package main

import (
	"log"
	"net/http"
	"os"

	"github.com/axelstr/mind-guide/backend/internal/estimation"
	"github.com/axelstr/mind-guide/backend/internal/logger"
	"github.com/axelstr/mind-guide/backend/internal/patients"
	"github.com/axelstr/mind-guide/backend/internal/planning"
	"github.com/axelstr/mind-guide/backend/internal/summary"
	"github.com/gin-gonic/gin"
)

const (
	knowledgeDBPath = "knowledge.txt"
	patientsDir     = "patients"
)

type Input struct {
	PatientRecord string `json:"patientRecord"`
	ProviderInput string `json:"providerInput"`
}

type Output struct {
	Estimation string `json:"estimation"`
	Plan       string `json:"plan"`
}

type Patient struct {
	Name    string `json:"name"`
	Summary string `json:"summary"`
	Record  string `json:"record"`
}

func main() {
	r := gin.Default()

	logger.Debug("Starting server")
	// Enable CORS
	r.Use(func(c *gin.Context) {
		logger.Debug("Handling CORS request: %s %s", c.Request.Method, c.Request.URL.Path)
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/process_patient", handleProcess)
	r.GET("/get_patients", handleGetPatients)

	log.Fatal(r.Run(":8080"))
}

func handleProcess(c *gin.Context) {
	logger.Debug("Handling process request")

	var input Input
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Error("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	knowledgeDB, err := os.ReadFile(knowledgeDBPath)
	if err != nil {
		logger.Error("Failed to read knowledge database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read knowledge database"})
		return
	}

	estimation, err := estimatePatientStatus(input.PatientRecord, input.ProviderInput, string(knowledgeDB))
	if err != nil {
		logger.Error("Failed to estimate patient status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to estimate patient status"})
		return
	}
	logger.Debug("Estimation result length: %d", len(estimation))
	plan, err := createActionPlan(estimation, input.PatientRecord, input.ProviderInput, string(knowledgeDB))
	if err != nil {
		logger.Error("Failed to create action plan: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create action plan"})
		return
	}
	logger.Debug("Plan result length: %d", len(plan))

	output := Output{
		Estimation: estimation,
		Plan:       plan,
	}

	c.JSON(http.StatusOK, output)
}

func estimatePatientStatus(patientRecord, providerInput, knowledgeDB string) (string, error) {
	return estimation.EstimatePatientStatus(patientRecord, providerInput, knowledgeDB)
}

func createActionPlan(estimation, patientRecord, providerInput, knowledgeDB string) (string, error) {
	return planning.CreateActionPlan(estimation, patientRecord, providerInput, knowledgeDB)
}

func handleGetPatients(c *gin.Context) {
	logger.Debug("Handling get patients request")

	patientFiles, err := patients.ReadPatientFiles(patientsDir)
	if err != nil {
		logger.Error("Failed to read patient files: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read patient files"})
		return
	}

	var patients []Patient
	for id, record := range patientFiles {
		summaryText, err := summary.Process(record)
		if err != nil {
			logger.Error("Failed to process summary for patient %s: %v", id, err)
			continue
		}
		patients = append(patients, Patient{
			Name:    id, // Assuming the name is the same as the ID for simplicity
			Summary: summaryText,
			Record:  record,
		})
	}

	c.JSON(http.StatusOK, patients)
}
