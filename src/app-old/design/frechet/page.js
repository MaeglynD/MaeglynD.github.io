"use client";

import Image from "next/image";
import s from "../design.module.css";
import { useState, Suspense } from "react";

export default function Design() {
  const [fullSrc, setFullSrc] = useState("");
  return (
    <>
      <div className={`${s.full} ${fullSrc ? s.active : ""}`} onClick={() => setFullSrc("")}>
        {fullSrc && (
          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="cursor-default data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
            width={2384}
            height={1500}
            src={fullSrc}
            onClick={(e) => e.stopPropagation()}
            alt="frechet"
          />
        )}
      </div>

      <div className={s.designContainer}>
        <div className={s.designInner}>
          <div className={s.designImgGridContainer}>
            <Image
              data-loaded="false"
              onLoad={(e) => {
                e.currentTarget.setAttribute("data-loaded", "true");
              }}
              className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
              width={2384}
              height={1500}
              src="/design/frechet/frechet-thumb.png"
              alt="frechet"
              onClick={() => setFullSrc("/design/frechet/frechet-thumb.png")}
            />

            <Image
              data-loaded="false"
              onLoad={(e) => {
                e.currentTarget.setAttribute("data-loaded", "true");
              }}
              className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
              width={2384}
              height={1500}
              src="/design/frechet/frechet.png"
              alt="frechet"
              onClick={() => setFullSrc("/design/frechet/frechet.png")}
            />
          </div>

          <div>
            <div className={s.designTitle}>Fréchet </div>
            <div className={s.designDesc}>
              A conceptual design named after mathematician René Maurice Fréchet. Created in part to test the
              feasibility of mixing AI-generated art and UI design. My current verdict: kindof.
              <br />
              <br /> At the time of writing this (2025), theres a very large gap between 'close to good enough' and
              'good enough' in all AI-gen media (with the possible exception of 3D models) and bridging that seeming 10%
              is 99% of the work and <b> really</b> tedious. To get something good, you'll either need a personality
              that doesn't mind trial-and-error'ing prompts for 3 hours or reward circuitry easily advected by the slop
              generated. (You know who you are. Get off the gaming chair, sell the RTX 4090 Ti and get a job). Anyways,
              its utterly remarkable and nothing short of miraculous that this is even possible, the reality of how
              incredible this all is is often lost on me. Heres some behind the scenes:
            </div>
          </div>

          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90 mt-[60px] mb-[30px]"
            width={2384}
            height={1500}
            src="/design/frechet/bts1.png"
            alt="frechet"
            onClick={() => setFullSrc("/design/frechet/bts1.png")}
          />
          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90 my-[30px]"
            width={2384}
            height={1500}
            src="/design/frechet/bts2.png"
            alt="frechet"
            onClick={() => setFullSrc("/design/frechet/bts2.png")}
          />

          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90 my-[30px]"
            width={2384}
            height={1500}
            src="/design/frechet/bts3.png"
            alt="frechet"
            onClick={() => setFullSrc("/design/frechet/bts3.png")}
          />

          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90 my-[30px]"
            width={2384}
            height={1500}
            src="/design/frechet/bts4.png"
            alt="frechet"
            onClick={() => setFullSrc("/design/frechet/bts4.png")}
          />
        </div>
      </div>
    </>
  );
}
