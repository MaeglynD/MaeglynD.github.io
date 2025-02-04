"use client";

import Image from "next/image";
import s from "./home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={s.container}>
      {/* <Image width={1005} height={958} priority={true} className={s.img} src="/image.png" alt="fluid" /> */}

      <div className={s.btnsContainer}>
        {/* <Link className={s.btn} href="/art">
          art
        </Link> */}

        <a className={s.btn} href="https://github.com/maeglynd" target="_blank">
          code
        </a>

        <Link className={s.btn} href="/blog">
          blog
        </Link>

        <a className={s.btn} href="https://www.abelian.shop/" target="_blank">
          shirts
        </a>
        <Link className={s.btn} href="/design">
          design
        </Link>

        {/* <Link className={s.btn} href="/bookshelf">
          bookshelf
        </Link> */}

        <Link className={s.btn} href="/philosophy">
          philosophy
        </Link>
      </div>
    </div>
  );
}
