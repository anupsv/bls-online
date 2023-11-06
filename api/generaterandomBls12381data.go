package handler

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	bls12381 "github.com/consensys/gnark-crypto/ecc/bls12-381"
	"github.com/consensys/gnark-crypto/ecc/bls12-381/fr"
	"math/big"
	"net/http"
)

type signature struct {
	*g1Point `json:"g1_point"`
}

type signatureG2 struct {
	*g2Point `json:"g2_point"`
}

type privateKey = fr.Element

type g1Point struct {
	*bls12381.G1Affine
}

type g2Point struct {
	*bls12381.G2Affine
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

func getG1Generator() *bls12381.G1Affine {
	g1Gen := new(bls12381.G1Affine)
	_, err := g1Gen.X.SetString("3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507")
	if err != nil {
		return nil
	}
	_, err = g1Gen.Y.SetString("1339506544944476473020471379941921221584933875938349620426543736416511423956335083465521527249495828405256773756384")
	if err != nil {
		return nil
	}
	return g1Gen
}

func mulByGeneratorG1(a *fr.Element) *bls12381.G1Affine {
	g1Gen := getG1Generator()
	return new(bls12381.G1Affine).ScalarMultiplication(g1Gen, a.BigInt(new(big.Int)))
}

func getG2Generator() *bls12381.G2Affine {
	g2Gen := new(bls12381.G2Affine)
	g2Gen.X.SetString("3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758",
		"927607592170922052780613013417202898960753115548134408600115262511377465524211510810830019149994470537785026143745453")
	g2Gen.Y.SetString("3527010695874666181871391160110601448900299527927752402199086442397937857357150268097124897762176",
		"1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905")
	return g2Gen
}

func mulByGeneratorG2(a *fr.Element) *bls12381.G2Affine {
	g2Gen := getG2Generator()
	return new(bls12381.G2Affine).ScalarMultiplication(g2Gen, a.BigInt(new(big.Int)))
}

func newKeyPair(sk *privateKey) *keyPair {
	pk := mulByGeneratorG1(sk)
	return &keyPair{sk, &g1Point{pk}}
}

func (k *keyPair) getPubKeyG2() *g2Point {
	return &g2Point{mulByGeneratorG2(k.PrivKey)}
}

func GeneraterandomBls12381data(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	maxInt := new(big.Int)
	maxInt.SetString(fr.Modulus().String(), 10)

	//Generate cryptographically strong pseudo-random between 0 - max
	n, _ := rand.Int(rand.Reader, maxInt)
	sk := new(privateKey).SetBigInt(n)
	skRep, _ := newPrivateKey(sk.String())
	pkRep := newKeyPair(sk)

	resp["pk"] = "0x" + skRep.Text(16)
	resp["g1.x"] = "0x" + pkRep.PubKey.X.Text(16)
	resp["g1.y"] = "0x" + pkRep.PubKey.Y.Text(16)
	resp["g2.x.a0"] = "0x" + pkRep.getPubKeyG2().X.A0.Text(16)
	resp["g2.x.a1"] = "0x" + pkRep.getPubKeyG2().X.A1.Text(16)
	resp["g2.y.a0"] = "0x" + pkRep.getPubKeyG2().Y.A0.Text(16)
	resp["g2.y.a1"] = "0x" + pkRep.getPubKeyG2().Y.A1.Text(16)

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error happened in JSON marshal. Err:", err)
	} else {
		w.Write(jsonResp)
	}
}
