package patients

import (
	"io/ioutil"
	"log"
	"path/filepath"
)

func ReadPatientFiles(dir string) (map[string]string, error) {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	patients := make(map[string]string)
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		content, err := ioutil.ReadFile(filepath.Join(dir, file.Name()))
		if err != nil {
			log.Printf("Failed to read file %s: %v", file.Name(), err)
			continue
		}
		id := file.Name()[:len(file.Name())-len(filepath.Ext(file.Name()))]
		patients[id] = string(content)
	}

	return patients, nil
}
