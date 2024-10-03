package estimation

import (
	"fmt"

	"github.com/axelstr/mind-guide/backend/internal/openai"
)

const promptEstimation = `Given the following patient record and provider input,
estimate the patient's current status. The status should contain three sections:
- Where in the process they are with the provider. For example, are they in the
initial contact, how many sessions have they been on.
- The diagnosis of the patient as based on the clinician. If the clinician has't
made a judment, provide a neutral statement.
- A 3rd point view of the patient's diagnosis without taking the clinicians
statement into account.
Only use the knowledge database provided to inform your estimation. Do not
provide any suggestions for treatment or action plans as that's provided in
upcoming steps.\n
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
