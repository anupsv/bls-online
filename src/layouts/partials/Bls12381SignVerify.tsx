"use client";


import React, {useState} from "react";


const Bls12381SignVerify = () => {

  const [pk, setPk] = useState("");
  const [message, setMessage] = useState("");
  const [sigG2, setSigG2] = useState("");
  const [sigG1, setSigG1] = useState("");
  const [signErr, setSignErr] = useState("");

  const handleChangePk = (e: React.FormEvent<HTMLInputElement>) => {
    setPk(e.currentTarget.value);
  };

  const handleChangeMsg = (e: React.FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const createSig = async () => {

    if (pk.length === 0){
      alert("Need private key to hash!")
      return;
    }

    if (message.length === 0){
      alert("Need message to hash!")
      return;
    }

    try {
      const res = await fetch(`/api/bls12381SignVerifyMessage?sign=true&pk=${encodeURIComponent(pk)}&message=${message}`)

      const data = await res.json();
      setSigG1(JSON.stringify({
        "x": data["g1.x"],
        "y": data["g1.y"]
      }));
      setSigG2(JSON.stringify({
        "x": {
          "c0": data["g2.x.a0"],
          "c1": data["g2.x.a1"],
        },
        "y":{
          "c0": data["g2.y.a0"],
          "c1": data["g2.y.a1"],
        }
      }));
    } catch (err) {
      console.log(err);
      // @ts-ignore
      setSignErr(err)
    }
  }

  return (
    <>
      <div className="mb-6">
        <label htmlFor="pk-sig-bls" className="form-label">
          Private Key (hex format)
        </label>
        <input
          id="pk-sig-bls"
          name="pk-sig-bls"
          value={pk}
          className="form-input"
          readOnly={false}
          onChange={handleChangePk}
          placeholder="Private Key"
          type="text"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="msg-sig-bls" className="form-label">
          Message To Sign
        </label>
        <input
          id="msg-sig-bls"
          name="msg-sig-bls"
          value={message}
          className="form-input"
          readOnly={false}
          placeholder="Message To Sign"
          type="text"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="sig-sig-bls-g1" className="form-label">
          Signature on G1
        </label>
        <input
          id="sig-sig-bls-g1"
          name="sig-sig-bls-g1"
          value={sigG1}
          className="form-input"
          readOnly={true}
          placeholder="Signature on G1 output"
          type="text"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="sig-sig-bls-g2" className="form-label">
          Signature on G2
        </label>
        <input
          id="sig-sig-bls-g2"
          name="sig-sig-bls-g2"
          value={sigG2}
          className="form-input"
          readOnly={true}
          placeholder="Signature on G2 output"
          type="text"
        />
      </div>

      <button type="submit" className="btn btn-primary" onClick={() => createSig()}>
        Hash
      </button>
    </>
  );
}

export default Bls12381SignVerify;
