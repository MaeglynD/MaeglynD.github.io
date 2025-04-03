"use client";

import s from "./page.module.css";
import ExportedImage from "next-image-export-optimizer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "swiper/css/mousewheel";

const projects = [
  {
    name: "Abelian",
    imgs: Array.from({ length: 4 }, (_, i) => `./images/abelian/${i}.png`),
    link: "https://www.abelian.shop/",
  },
  {
    name: "Wakayama",
    imgs: Array.from({ length: 5 }, (_, i) => `./images/wakayama/${i}.png`),
    link: "http://wakayama.vercel.app/",
  },
  {
    name: "Jyocho",
    imgs: Array.from({ length: 3 }, (_, i) => `./images/jyocho/${i}.png`),
    link: "https://maeglynd.github.io/jyocho",
  },
  {
    name: "Shapes&Colors",
    imgs: Array.from({ length: 3 }, (_, i) => `./images/Shapes&Colors/${i}.png`),
    link: "https://shapes-and-colors.vercel.app/",
  },
  {
    name: "S.L",
    imgs: Array.from({ length: 4 }, (_, i) => `./images/sl/${i}.png`),
    link: "https://github.com/MaeglynD/SL",
  },
];

export default function Home() {
  return (
    <div className={s.container}>
      <div className={s.projectsContainer}>
        {projects.map((p, i) => (
          <div key={`p-${i}`} className={s.project}>
            <div className={s.projectImgs}>
              <Swiper
                className={s.swiper}
                slidesPerView={"auto"}
                spaceBetween={30}
                loop={true}
                navigation={false}
                pagination={{
                  clickable: true,
                }}
                mousewheel={true}
                modules={[Mousewheel]}
              >
                {p.imgs.map((img, j) => (
                  <SwiperSlide key={`p-${i}-img-${j}`} className={s.imgWrapper}>
                    <ExportedImage
                      src={img}
                      alt={p.name}
                      height={281}
                      width={500}
                      placeholder="blur"
                      priority={true}
                      className={s.projectImg}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <a target="_blank" href={p.link} className={s.projectTitle}>
              {p.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
