package estimation

import (
	"fmt"

	"github.com/axelstr/mind-guide/backend/internal/openai"
)

const promptEstimation = `Given the following patient record and provider input,
estimate the patient's current status. Only use the knowledge database provided
to inform your estimation.\n
---
Patient Record:\n\n%s
---
Provider Input:\n\n%s
---
Knowledge Database:\n\n%s`

func EstimatePatientStatus(patientRecord, providerInput, knowledgeDB string) (string, error) {
	prompt := fmt.Sprintf(promptEstimation, patientRecord, providerInput, knowledgeDB)
	return openai.CallOpenAI(prompt)
}
