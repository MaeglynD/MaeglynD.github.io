"use client";

import Image from "next/image";
import s from "./home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={s.container}>
      {/* <Nav /> */}
      <div className={s.about}>
        <div className={s.header}>About</div>

        <div className={s.desc}>
          An About Section is a fascinating insight into a person's mind. Think about what it says about a person’s grip
          on reality, to confidently point and say <b>that</b> right there is me. The safety it exudes to embody labels
          and tasks, as if they were a simple continuation of the environment and needn’t be feared, like a rock amidst
          stream. Yes, surely anyone who’s able to write a simple yet direct About Section is trustworthy, reliable and
          can safely be considered sane. (If you're a potential employer, please see my more serious About & Business
          Section{" "}
          <Link href="/business-plan" className="text-sky-500">
            here
          </Link>
          )
        </div>
      </div>

      <div className={s.blog}>
        <div className={s.header}>Blog</div>

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

        <Link href="/blog" className={s.viewAll}>
          View all
        </Link>
      </div>

      <div className={s.design}>
        <div className={s.header}>Design </div>

        <div className={s.designLinks}>
          <Link href="/design/frechet" className={s.designLink}>
            <Image
              className={s.designImg}
              src="/design/frechet/frechet-thumb.png"
              height={540}
              width={968}
              alt="thumb"
            />
            <div className={s.designTitle}>Fréchet</div>
            <div className={s.designDesc}>Conceptual beauty brand</div>
          </Link>

          <Link href="/design/bookmarker" className={s.designLink}>
            <Image
              className={s.designImg}
              src="/design/bookmarker/bookmarker-thumb.png"
              height={540}
              width={968}
              alt="thumb"
            />
            <div className={s.designTitle}>Bookmarker</div>
            <div className={s.designDesc}>Analytics, for bookmarks</div>
          </Link>
          <Link href="/design" className={s.viewAll}>
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
