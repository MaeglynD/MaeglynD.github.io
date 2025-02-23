"use client";

import Link from "next/link";
import Image from "next/image";
import s from "../home.module.css";

export default function Blog() {
  return (
    <div className={s.container}>
      <div className={s.blog}>
        <div className={s.header}>Posts</div>

        <Link href="/blog/fluid-dynamics" className={s.blogLink}>
          <div className={s.blogText}>
            <div className={s.blogHead}>Checking in with the fluid dynamicists (and some light grmhd)</div>

            <div className={s.blogDate}>17 Feb, 2025</div>
          </div>
          <Image
            className={s.thumb}
            src="/fluid-dynamics/thumb.png"
            width={400}
            height={400}
            alt="fluid dynamics blog"
          />
        </Link>

        <Link href="/blog/fourier" className={s.blogLink}>
          <div className={s.blogText}>
            <div className={s.blogHead}>
              Fourier transforms, fourier optics, fourier neural operators and fourier island
            </div>

            <div className={s.blogDate}>17 Jan, 2025</div>
          </div>
          <Image className={s.thumb} src="/fourier/thumb.png" width={400} height={400} alt="fourier blog" />
        </Link>

        <Link href="/blog/visualising-hydrogen" className={s.blogLink}>
          <div className={s.blogText}>
            <div className={s.blogHead}>Visualising hydrogenic energy eigenfunctions and spherical harmonics</div>

            <div className={s.blogDate}>27 Dec, 2024</div>
          </div>
          <Image className={s.thumb} src="/hydrogen/thumb.png" width={400} height={400} alt="hydrogen blog" />
        </Link>
      </div>
    </div>
  );
}
