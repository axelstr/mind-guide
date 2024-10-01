package planning

import (
	"fmt"

	"github.com/axelstr/mind-guide/backend/internal/openai"
)

const promptPlanning = `Based on the following estimation, patient record, and
provider input, create an action plan including scheduling and prescription
recommendations for the patient. Only use the knowledge database provided to
inform your plan.
---
Estimation:\n\n%s
---
Patient Record:\n\n%s
---
Provider Input:\n\n%s
---
Knowledge Database:\n\n%s`

func CreateActionPlan(estimation, patientRecord, providerInput, knowledgeDB string) (string, error) {
	prompt := fmt.Sprintf(promptPlanning, estimation, patientRecord, providerInput, knowledgeDB)
	return openai.CallOpenAI(prompt)
}
