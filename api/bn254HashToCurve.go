package handler

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/consensys/gnark-crypto/ecc/bn254"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr"
	"math/big"
	"net/http"
	"net/url"
)

type signature struct {
	*g1Point `json:"g1_point"`
}

type signatureG2 struct {
	*g2Point `json:"g2_point"`
}

type privateKey = fr.Element

type g1Point struct {
	*bn254.G1Affine
}

type g2Point struct {
	*bn254.G2Affine
}

type keyPair struct {
	PrivKey *privateKey
	PubKey  *g1Point
}

func newPrivateKey(sk string) (*privateKey, error) {
	ele, err := new(fr.Element).SetString(sk)
	if err != nil {
		return nil, err
	}
	return ele, nil
}

func getG1Generator() *bn254.G1Affine {
	g1Gen := new(bn254.G1Affine)
	_, err := g1Gen.X.SetString("1")
	if err != nil {
		return nil
	}
	_, err = g1Gen.Y.SetString("2")
	if err != nil {
		return nil
	}
	return g1Gen
}

func mulByGeneratorG1(a *fr.Element) *bn254.G1Affine {
	g1Gen := getG1Generator()
	return new(bn254.G1Affine).ScalarMultiplication(g1Gen, a.BigInt(new(big.Int)))
}

func getG2Generator() *bn254.G2Affine {
	g2Gen := new(bn254.G2Affine)
	g2Gen.X.SetString("10857046999023057135944570762232829481370756359578518086990519993285655852781",
		"11559732032986387107991004021392285783925812861821192530917403151452391805634")
	g2Gen.Y.SetString("8495653923123431417604973247489272438418190587263600148770280649306958101930",
		"4082367875863433681332203403145435568316851327593401208105741076214120093531")
	return g2Gen
}

func mulByGeneratorG2(a *fr.Element) *bn254.G2Affine {
	g2Gen := getG2Generator()
	return new(bn254.G2Affine).ScalarMultiplication(g2Gen, a.BigInt(new(big.Int)))
}

func newKeyPair(sk *privateKey) *keyPair {
	pk := mulByGeneratorG1(sk)
	return &keyPair{sk, &g1Point{pk}}
}

func (k *keyPair) getPubKeyG2() *g2Point {
	return &g2Point{mulByGeneratorG2(k.PrivKey)}
}

func gimmeHex(data string) string {
	return "0x" + hex.EncodeToString([]byte(data))
}

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

	message, _ := url.QueryUnescape(r.URL.Query().Get("message"))

	resp["g1.x"] = MapToCurve([32]byte([]byte(message))).X.String()
	resp["g1.y"] = MapToCurve([32]byte([]byte(message))).Y.String()

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error happened in JSON marshal. Err:", err)
	} else {
		w.Write(jsonResp)
	}
}
