"use client";

import Image from "next/image";
import s from "../design.module.css";
import { useState, Suspense } from "react";

export default function Bookmarker() {
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
            alt="bookmarker"
          />
        )}
      </div>

      <div className={s.designContainer}>
        <div className={s.designInner}>
          <div className="grid gap-[30px] mt-[30px] grid-cols-[2.86fr_1fr]">
            <Image
              data-loaded="false"
              onLoad={(e) => {
                e.currentTarget.setAttribute("data-loaded", "true");
              }}
              className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
              width={2384}
              height={1500}
              src="/design/niobium/niobium-thumb.png"
              alt="frechet"
              onClick={() => setFullSrc("/design/niobium/niobium-thumb.png")}
            />

            <Image
              data-loaded="false"
              onLoad={(e) => {
                e.currentTarget.setAttribute("data-loaded", "true");
              }}
              className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
              width={2384}
              height={1500}
              src="/design/niobium/niobium.png"
              alt="frechet"
              onClick={() => setFullSrc("/design/niobium/niobium.png")}
            />
          </div>

          <div>
            <div className={s.designTitle}>Niobium</div>
            <div className={s.designDesc}>
              A conceptual computational fluid dynamics OSS landing page. Named, for particular reason, after{" "}
              <a href="https://en.wikipedia.org/wiki/Niobium_triselenide" target="_blank" className="text-sky-500">
                niobium triselenide
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
