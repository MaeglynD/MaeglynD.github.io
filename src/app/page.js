"use client";

import Image from "next-image-export-optimizer";
import s from "./home.module.css";
import Link from "next/link";
import LatticeBoltzmann from "@/components/lattice-boltzmann";

export default function Home() {
  return (
    <div className={s.container}>
      {/* <Nav /> */}
      <div className={s.about}>
        <div className={s.header}>About</div>

        <div className={s.desc}>
          Hi, I'm a full stack engineer with main interests in UI, infra, mathematical physics, neural networks and all forms of visualisation. I'm in love with
          learning and currently studying molecular biology in my free time. If you're a potential employer, please see my more serious career page{" "}
          <Link
            href="/business-plan"
            className="text-sky-500"
          >
            here
          </Link>
        </div>
      </div>

      <div className={s.visual}>
        <LatticeBoltzmann />
      </div>
    </div>
  );
}
