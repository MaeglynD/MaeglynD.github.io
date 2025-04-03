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
          <div className="mt-30px">
            <Image
              data-loaded="false"
              onLoad={(e) => {
                e.currentTarget.setAttribute("data-loaded", "true");
              }}
              className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
              width={2384}
              height={1500}
              src="/design/bookmarker/bookmarker.png"
              alt="bookmarker"
              onClick={() => setFullSrc("/design/bookmarker/bookmarker.png")}
            />
          </div>

          <div>
            <div className={s.designTitle}>Bookmarker</div>
            <div className={s.designDesc}>
              A simple drag-and-drop filtering, organising and analysis tool for bookmarks that I'm currently actively
              developing.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
