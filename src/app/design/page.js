"use client";

import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import s from "./design.module.css";
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
          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
            width={2384}
            height={1500}
            src="/design/frechet.png"
            alt="frechet"
            onClick={() => setFullSrc("/design/frechet.png")}
          />

          <div className={s.designText}>
            <div className={s.designTitle}>
              <div>Fréchet </div>
              <div className={s.designDate}> 2024</div>
            </div>
          </div>
        </div>

        <div className={s.designInner}>
          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
            width={2384}
            height={1500}
            src="/design/misaki.png"
            onClick={() => setFullSrc("/design/misaki.png")}
            alt="frechet"
          />

          <div className={s.designText}>
            <div className={s.designTitle}>
              <div>Concept </div>
              <div className={s.designDate}> 2024</div>
            </div>
          </div>
        </div>

        <div className={s.designInner}>
          {/* <Image
          data-loaded="false"
          onLoad={(e) => {
            e.currentTarget.setAttribute("data-loaded", "true");
          }}
          className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100"
          width={2384}
          height={1500}
          priority={true}
          src="/design/abelian.png"
          alt="frechet"
        /> */}

          <Image
            data-loaded="false"
            onLoad={(e) => {
              e.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100"
            width={2384}
            height={1500}
            src="/design/abelian2.png"
            onClick={() => setFullSrc("/design/abelian2.png")}
            alt="frechet"
          />
          <div className={s.designText}>
            <div className={s.designTitle}>
              <div>Abelian</div>
              <div className={s.designDate}> 2024</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
