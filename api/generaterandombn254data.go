package handler

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr"
	"math/big"
	"net/http"
)

func Generaterandombn254data(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	maxInt := new(big.Int)
	maxInt.SetString(fr.Modulus().String(), 10)

	//Generate cryptographically strong pseudo-random between 0 - max
	n, _ := rand.Int(rand.Reader, maxInt)
	sk := new(PrivateKey).SetBigInt(n)
	skRep, _ := NewPrivateKey(sk.String())
	pkRep := NewKeyPair(sk)

	resp["pk"] = gimmeHex(skRep.String())
	resp["g1.x"] = gimmeHex(pkRep.PubKey.X.String())
	resp["g1.y"] = gimmeHex(pkRep.PubKey.Y.String())
	resp["g2.x.c0"] = gimmeHex(pkRep.GetPubKeyG2().X.A0.String())
	resp["g2.x.c1"] = gimmeHex(pkRep.GetPubKeyG2().X.A1.String())
	resp["g2.y.c0"] = gimmeHex(pkRep.GetPubKeyG2().Y.A0.String())
	resp["g2.y.c1"] = gimmeHex(pkRep.GetPubKeyG2().Y.A1.String())

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error happened in JSON marshal. Err:", err)
	} else {
		w.Write(jsonResp)
	}
}
