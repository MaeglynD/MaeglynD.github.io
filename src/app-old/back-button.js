"use client";

import { useRouter, usePathname } from "next/navigation";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

export default function BackBtn() {
  const router = useRouter();
  const pathname = usePathname();
  const f = String.raw`$f^{-1}$`;

  if (pathname !== "/") {
    return (
      <button className="backBtn" onClick={() => router.back()}>
        <Latex>{f}</Latex>
      </button>
    );
  }
}
