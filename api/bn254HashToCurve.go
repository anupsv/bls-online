package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Bn254HashToCurve(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)

	decoder := json.NewDecoder(r.Body)
	data := make(map[string]string)
	err := decoder.Decode(&data)
	if err != nil {
		panic(err)
	}

	resp["g1.x"] = MapToCurve([32]byte([]byte(data["message"]))).X.String()
	resp["g1.y"] = MapToCurve([32]byte([]byte(data["message"]))).Y.String()

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error happened in JSON marshal. Err:", err)
	} else {
		w.Write(jsonResp)
	}
}
