"use client";

import React, {useState} from "react";

const Home = () => {
  const [pkBls, setPk] = useState("");
  const [g1Bls, setG1] = useState("");
  const [g2Bls, setG2] = useState("");
  const [g1HashToCurveBls, setG1HashToCurveBls] = useState("");
  const [g2HashToCurveBls, setG2HashToCurveBls] = useState("");
  const [hashErrBls, setHashErrBls] = useState("");
  const [genErrBls, setGenErrBls] = useState("");
  const [hashDataBls, setHashDataBls] = useState("");

  const [pkBn, setPkBn] = useState("");
  const [g1Bn, setG1Bn] = useState("");
  const [g2Bn, setG2Bn] = useState("");
  const [hashDataBn, setHashDataBn] = useState("");
  const [hashErrBn, setHashErrBn] = useState("");
  const [genErrBn, setGenErr] = useState("");
  const [g1HashToCurveBn, setG1HashToCurveBn] = useState("");
  const [g2HashToCurveBn, setG2HashToCurveBn] = useState("");

  const handleChangeBn = (e: React.FormEvent<HTMLInputElement>) => {
    setHashDataBn(e.currentTarget.value);
  };

  const runBn254 = async () => {
    try {
      const res = await fetch(`/api/generaterandombn254data`);
      const data = await res.json();
      setPkBn(data["pk"]);
      setG1Bn(JSON.stringify({
        "x": data["g1.x"],
        "y": data["g1.y"]
      }));
      setG2Bn(JSON.stringify({
        "x": {
          "c0": data["g2.x.c0"],
          "c1": data["g2.x.c1"],
        },
        "y":{
          "c0": data["g2.y.c0"],
          "c1": data["g2.y.c1"],
        }
      }));
    } catch (err) {
      console.log(err);
      // @ts-ignore
      setGenErr(err);
    }
  };

  const runHashToCurveBls = async () => {

  }
  const runHashToCurveBn = async () => {

    if (hashDataBn.length === 0){
      alert("Need data to hash!")
      return;
    }

    try {
      const res = await fetch(`/api/bn254HashToCurve?message=${encodeURIComponent(hashDataBn)}`)

      const data = await res.json();
      setG1HashToCurveBn(JSON.stringify({
        "x": data["g1.x"],
        "y": data["g1.y"]
      }));
      setG2HashToCurveBn(JSON.stringify({
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
      setHashErrBn(err)
    }
  }

  const runBls12381 = async () => {

    try{
      const res = await fetch(`/api/generaterandomBls12381data`);
      const data = await res.json();
      setPk(data["pk"])
      setG1(JSON.stringify({x: data["g1.x"], y: data["g1.y"]}))
      setG2(JSON.stringify({        x: {
          c0: data["g2.x.a0"],
          c1: data["g2.x.a1"]
        },
        y: {
          c0: data["g2.x.a0"],
          c1: data["g2.x.a1"]
        }}))

    } catch (e) {
      console.log(e)
    }
  };

  const renderErr = (errr: string) => {
    return errr && <div className={`notice error`}>
      <div className="notice-head">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 0C15.522 0 20 4.478 20 10C20 15.522 15.522 20 10 20C4.478 20 0 15.522 0 10C0 4.478 4.478 0 10 0ZM10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C14.411 18 18 14.411 18 10C18 5.589 14.411 2 10 2ZM12.293 6.293L13.707 7.707L11.414 10L13.707 12.293L12.293 13.707L10 11.414L7.707 13.707L6.293 12.293L8.586 10L6.293 7.707L7.707 6.293L10 8.586L12.293 6.293Z"
            fill="currentColor"
          />
        </svg>
        <p className="my-0 ml-1.5">Error</p>
      </div>
      <div className="notice-body">{errr}</div>
    </div>
  }

  return (
    <section className="section-sm">
      <div className="container">
        <div className="row">
          <div className="mx-auto md:col-10 lg:col-6">
            <div className={"content"}>
                <h2 className="mb-4">BN254 Curve</h2>
                <hr/>
                <div className="mb-6">
                  <label htmlFor="pkBn" className="form-label">
                    Private Key
                  </label>
                  <input
                    id="pkBn"
                    name="pkBn"
                    value={pkBn}
                    className="form-input"
                    readOnly={true}
                    placeholder="Private Key"
                    type="text"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="g1Bn" className="form-label">
                    G1 PubKey (X,Y,compressed)
                  </label>
                  <input
                    id="g1Bn"
                    name="g1Bn"
                    value={g1Bn}
                    className="form-input"
                    placeholder="{x:{'0x...'}, y:{'0x...'}}"
                    type="text"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="g2Bn" className="form-label">
                    G2 PubKey ( X(c0,c1), Y(c0,c1), compressed )
                  </label>
                  <input
                    id="g2Bn"
                    name="g2Bn"
                    value={g2Bn}
                    className="form-input"
                    placeholder="{x:{c0: ..., c1: ...}, y:{c0: ..., c1: ...}}"
                    type="text"
                  />
                </div>
                <button type="submit" className="btn btn-primary" onClick={() => runBn254()}>
                  Generate
                </button>

              {renderErr(genErrBn)}

              <hr />

              <div className="mb-6">
                <label htmlFor="hash-data-bn" className="form-label">
                  Data To Hash
                </label>
                <input
                  id="hash-data-bn"
                  name="hashDataBn"
                  value={hashDataBn}
                  onChange={handleChangeBn}
                  className="form-input"
                  readOnly={false}
                  placeholder="Message to Hash to curve"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g1-bn" className="form-label">
                  G1 Hash to Curve
                </label>
                <input
                  id="hash-g1-bn"
                  name="hashG1Bn"
                  value={g1HashToCurveBn}
                  className="form-input"
                  readOnly={true}
                  placeholder="G1 Hash to Curve output"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g2-bn" className="form-label">
                  G2 Hash to Curve
                </label>
                <input
                  id="hash-g2-bn"
                  name="hashG2Bn"
                  value={g2HashToCurveBn}
                  className="form-input"
                  readOnly={true}
                  placeholder="G2 Hash to Curve output"
                  type="text"
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={() => runHashToCurveBn()}>
                Hash
              </button>
              {renderErr(hashErrBn)}
            </div>
          </div>

          {/* BLS 12-381 */}

          <div className="mx-auto md:col-10 lg:col-6">
            <div className={"content"}>
              <h2 className="mb-4">BLS12-381 Curve</h2>
              <hr/>
              <div className="mb-6">
                <label htmlFor="pkBls" className="form-label">
                  Private Key
                </label>
                <input
                  id="pkBls"
                  name="pkBls"
                  value={pkBls}
                  className="form-input"
                  readOnly={true}
                  placeholder="Private Key"
                  type="text"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="g1Bls" className="form-label">
                  G1 PubKey (X,Y,compressed)
                </label>
                <input
                  id="g1Bls"
                  name="g1Bls"
                  value={g1Bls}
                  className="form-input"
                  placeholder="{x:{'0x...'}, y:{'0x...'}, compressed: ''0x...'}"
                  type="text"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="g2Bls" className="form-label">
                  G2 PubKey ( X(c0,c1), Y(c0,c1), compressed )
                </label>
                <input
                  id="g2Bls"
                  name="g2Bls"
                  value={g2Bls}
                  className="form-input"
                  placeholder="{x:{c0: ..., c1: ...}, y:{c0: ..., c1: ...}, compressed:'0x...'}"
                  type="text"
                />
              </div>
              <button type="submit" className="btn btn-primary" onClick={() => runBls12381()}>
                Generate
              </button>

              {renderErr(genErrBls)}

              <div className="mb-6">
                <label htmlFor="hashDataBls" className="form-label">
                  Data To Hash
                </label>
                <input
                  id="hashDataBls"
                  name="hashDataBls"
                  value={hashDataBls}
                  onChange={handleChangeBn}
                  className="form-input"
                  readOnly={false}
                  placeholder="Message to Hash to curve"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g1-bls" className="form-label">
                  G1 Hash to Curve
                </label>
                <input
                  id="hash-g1-bls"
                  name="hashG1Bls"
                  value={g1HashToCurveBls}
                  className="form-input"
                  readOnly={true}
                  placeholder="G1 Hash to Curve output"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g2-bls" className="form-label">
                  G2 Hash to Curve
                </label>
                <input
                  id="hash-g2-bls"
                  name="hashG2Bls"
                  value={g2HashToCurveBls}
                  className="form-input"
                  readOnly={true}
                  placeholder="G2 Hash to Curve output"
                  type="text"
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={() => runHashToCurveBls()}>
                Hash
              </button>
              {renderErr(hashErrBls)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
