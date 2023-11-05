"use client";

import { bls12_381 } from '@noble/curves/bls12-381';
import {useState} from "react";
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';

const Home = () => {
  const [pk, setPk] = useState("");
  const [g1, setG1] = useState("");
  const [g2, setG2] = useState("");
  const [g1HashToCurve, setG1HashToCurve] = useState("");
  const [g2HashToCurve, setG2HashToCurve] = useState("");

  const [pkBn, setPkBn] = useState("");
  const [g1Bn, setG1Bn] = useState("");
  const [g2Bn, setG2Bn] = useState("");

  const runBn254 = async () => {
    // const privateKey = bn254.utils.randomPrivateKey()
    // setPkBn(`0x${bytesToHex(privateKey)}`)
    // const publicKeyG1 = bn254.ProjectivePoint.fromPrivateKey(privateKey)
    // // const publicKeyG2 = bls12_381.G2.ProjectivePoint.fromPrivateKey(privateKey);
    // setG1Bn(JSON.stringify({x: bnToHex(publicKeyG1.x), y: bnToHex(publicKeyG1.y), compressed: `0x${publicKeyG1.toHex(true)}`}))

    try {
      const res = await fetch(`/api/generaterandombn254data`);
      const data = await res.json();
      console.log(data);
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

  const runBls12381 = () => {
    const privateKey = bls12_381.utils.randomPrivateKey();
    setPk(`0x${bytesToHex(privateKey)}`)
    const publicKeyG1 = bls12_381.G1.ProjectivePoint.fromPrivateKey(privateKey);
    const publicKeyG2 = bls12_381.G2.ProjectivePoint.fromPrivateKey(privateKey);
    setG1(JSON.stringify({x: bnToHex(publicKeyG1.x), y: bnToHex(publicKeyG1.y), compressed: `0x${publicKeyG1.toHex(true)}`}))
    setG2(JSON.stringify({
      x: {
        c0: bnToHex(publicKeyG2.x.c0),
        c1: bnToHex(publicKeyG2.x.c1),
      },
      y: {
        c0: bnToHex(publicKeyG2.y.c0),
        c1: bnToHex(publicKeyG2.y.c1),
      },
      compressed: `0x${publicKeyG2.toHex(true)}`}
    ))
  };

  const bnToHex = (bn: bigint) => {
    let hex = bn.toString(16);
    if (hex.length % 2) {
      hex = '0' + hex;
    }
    return `0x${hex}`;
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
                    placeholder="{x:{'0x...'}, y:{'0x...'}, compressed: ''0x...'}"
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
                    className="form-input"
                    placeholder="G2 TBD"
                    type="text"
                  />
                </div>
                <button type="submit" className="btn btn-primary" onClick={() => runBn254()}>
                  Generate
                </button>
            </div>
          </div>

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
