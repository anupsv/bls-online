package handler

import (
	"encoding/json"
	"fmt"
	"github.com/consensys/gnark-crypto/ecc/bn254"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	"math/big"
	"net/http"
)

func MapToCurve(digest [32]byte) *bn254.G1Affine {

	one := new(big.Int).SetUint64(1)
	three := new(big.Int).SetUint64(3)
	x := new(big.Int)
	x.SetBytes(digest[:])
	for {
		// y = x^3 + 3
		xP3 := new(big.Int).Exp(x, big.NewInt(3), fp.Modulus())
		y := new(big.Int).Add(xP3, three)
		y.Mod(y, fp.Modulus())

		if y.ModSqrt(y, fp.Modulus()) == nil {
			x.Add(x, one).Mod(x, fp.Modulus())
		} else {
			var fpX, fpY fp.Element
			fpX.SetBigInt(x)
			fpY.SetBigInt(y)
			return &bn254.G1Affine{
				X: fpX,
				Y: fpY,
			}
		}
	}
}

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
