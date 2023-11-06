"use client";

import React, {useState} from "react";

const Home = () => {
  const [pk, setPk] = useState("");
  const [g1, setG1] = useState("");
  const [g2, setG2] = useState("");
  const [g1HashToCurve, setG1HashToCurve] = useState("");
  const [hashData, setHashData] = useState("");
  const [g2HashToCurve, setG2HashToCurve] = useState("");
  const [hashErr, setHashErr] = useState("");

  const [pkBn, setPkBn] = useState("");
  const [g1Bn, setG1Bn] = useState("");
  const [g2Bn, setG2Bn] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setHashData(e.currentTarget.value);
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
    }
  };

  const runHashToCurve = async () => {

    if (hashData.length === 0){
      alert("Need data to hash!")
      return;
    }

    try {
      const res = await fetch(`/api/bn254HashToCurve?message=${encodeURIComponent(hashData)}`)

      const data = await res.json();
      setG1HashToCurve(JSON.stringify({
        "x": data["g1.x"],
        "y": data["g1.y"]
      }));
      setG2HashToCurve(JSON.stringify({
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
      setHashErr(err)
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
              <hr />

              <div className="mb-6">
                <label htmlFor="hash-data" className="form-label">
                  Data To Hash
                </label>
                <input
                  id="hash-data"
                  name="hashData"
                  value={hashData}
                  onChange={handleChange}
                  className="form-input"
                  readOnly={false}
                  placeholder="Message to Hash to curve"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g1" className="form-label">
                  G1 Hash to Curve
                </label>
                <input
                  id="hash-g1"
                  name="hashG1"
                  value={g1HashToCurve}
                  className="form-input"
                  readOnly={true}
                  placeholder="G1 Hash to Curve output"
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="hash-g2" className="form-label">
                  G2 Hash to Curve
                </label>
                <input
                  id="hash-g2"
                  name="hashG2"
                  value={g2HashToCurve}
                  className="form-input"
                  readOnly={true}
                  placeholder="G2 Hash to Curve output"
                  type="text"
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={() => runHashToCurve()}>
                Hash
              </button>

              {hashErr
                &&
                <div className={`notice error`}>
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
                  <div className="notice-body">{hashErr}</div>
                </div>
              }

            </div>
          </div>

          {/* BLS 12-381 */}

          <div className="mx-auto md:col-10 lg:col-6">
            <div className={"content"}>
              <h2 className="mb-4">BLS12-381 Curve</h2>
              <hr/>
              <div className="mb-6">
                <label htmlFor="pk" className="form-label">
                  Private Key
                </label>
                <input
                  id="pk"
                  name="name"
                  value={pk}
                  className="form-input"
                  readOnly={true}
                  placeholder="Private Key"
                  type="text"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="g1" className="form-label">
                  G1 PubKey (X,Y,compressed)
                </label>
                <input
                  id="g1"
                  name="g1"
                  value={g1}
                  className="form-input"
                  placeholder="{x:{'0x...'}, y:{'0x...'}, compressed: ''0x...'}"
                  type="text"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="g2" className="form-label">
                  G2 PubKey ( X(c0,c1), Y(c0,c1), compressed )
                </label>
                <input
                  id="g2"
                  name="g2"
                  value={g2}
                  className="form-input"
                  placeholder="{x:{c0: ..., c1: ...}, y:{c0: ..., c1: ...}, compressed:'0x...'}"
                  type="text"
                />
              </div>
              <button type="submit" className="btn btn-primary" onClick={() => runBls12381()}>
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    // <>
    //   <section className="section pt-14">
    //     <div className="container">
    //       <div className="row justify-center">
    //         <div className="mb-16 text-center lg:col-7">
    //           <h1
    //             className="mb-4"
    //             dangerouslySetInnerHTML={markdownify(banner.title)}
    //           />
    //           <p
    //             className="mb-8"
    //             dangerouslySetInnerHTML={markdownify(banner.content ?? "")}
    //           />
    //           {banner.button!.enable && (
    //             <a className="btn btn-primary" href={banner.button!.link}>
    //               {banner.button!.label}
    //             </a>
    //           )}
    //         </div>
    //         {banner.image && (
    //           <div className="col-12">
    //             <ImageFallback
    //               src={banner.image}
    //               className="mx-auto"
    //               width="800"
    //               height="420"
    //               alt="banner image"
    //               priority
    //             />
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </section>
    //
    //   {features.map((feature, index: number) => (
    //     <section
    //       key={index}
    //       className={`section-sm ${index % 2 === 0 && "bg-gradient"}`}
    //     >
    //       <div className="container">
    //         <div className="row items-center justify-between">
    //           <div
    //             className={`mb:md-0 mb-6 md:col-5 ${
    //               index % 2 !== 0 && "md:order-2"
    //             }`}
    //           >
    //             <ImageFallback
    //               src={feature.image}
    //               height={480}
    //               width={520}
    //               alt={feature.title}
    //             />
    //           </div>
    //           <div
    //             className={`md:col-7 lg:col-6 ${
    //               index % 2 !== 0 && "md:order-1"
    //             }`}
    //           >
    //             <h2
    //               className="mb-4"
    //               dangerouslySetInnerHTML={markdownify(feature.title)}
    //             />
    //             <p
    //               className="mb-8 text-lg"
    //               dangerouslySetInnerHTML={markdownify(feature.content)}
    //             />
    //             <ul>
    //               {feature.bulletpoints.map((bullet: string) => (
    //                 <li className="relative mb-4 pl-6" key={bullet}>
    //                   <FaCheck className={"absolute left-0 top-1.5"} />
    //                   <span dangerouslySetInnerHTML={markdownify(bullet)} />
    //                 </li>
    //               ))}
    //             </ul>
    //             {feature.button.enable && (
    //               <a
    //                 className="btn btn-primary mt-5"
    //                 href={feature.button.link}
    //               >
    //                 {feature.button.label}
    //               </a>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </section>
    //   ))}
    //
    //   <Testimonials data={testimonial} />
    //   <CallToAction data={callToAction} />
    // </>
  );
};

export default Home;
