package summary

import (
	"fmt"

	"github.com/axelstr/mind-guide/backend/internal/openai"
)

const prompt = `Based on the following patient record, summarize the state of
the patient in 150-350 characters for a clinician. Don't make a judgement about
the patient's condition, just summarize the information and more importantly
about the initial context and maybe briefly about the clinicians summary.
---
Record:\n\n%s
`

func Process(patientRecord string) (string, error) {
	prompt := fmt.Sprintf(prompt, patientRecord)
	return openai.CallOpenAI(prompt)
}
