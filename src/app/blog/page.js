"use client";

import Link from "next/link";
import Image from "next/image";
import s from "./blog.module.css";
import { gruvboxColors } from "./utils";

function Post({ id, title, desc, tags, thumb, href }) {
  return (
    <Link className={s.post} href={href}>
      <div className={s.dateContainer}>Jan. 2, 2025</div>
      <div className={s.textContainer}>
        <div className={s.title}>{title}</div>
        <div className={s.desc}>{desc}</div>
        <div className={s.tags}>
          {tags.map((tag, i) => (
            <div
              className={s.tag}
              key={`tag-${i}`}
              // style={{ color: gruvboxColors[i + 5], borderColor: gruvboxColors[i + 5] }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className={s.thumbContainer}>
        {thumb && <Image className={s.thumb} src={thumb} width={400} height={400} alt="placeholder" />}
      </div>
    </Link>
  );
}

const posts = [
  //   {
  //   id: 1,
  //   title: "",
  //   desc: ",
  //   tags: ["Math"],
  //   thumb: "/fluid-dynamics.png",
  //   href: "/blog/visualising-hydrogen",
  // },
  {
    id: 1,
    title: " Visualising hydrogenic energy eigenfunctions, spherical harmonics and time-dependent oscillating orbitals",
    desc: "Taking a tourists stroll through a derivation of the hydrogen-like wavefunction and programming / rendering simulations for fun along the way",
    tags: ["Math", "Python", "JS", "Visualisation", "Physics"].sort((a, b) => a.localeCompare(b)),
    thumb: "/hydrogen/thumb.png",
    href: "/blog/visualising-hydrogen",
  },
  // { title: "", desc: "", tags: [], thumb: "" },
];

export default function Blog() {
  return (
    <div className={s.container}>
      {posts.map((post) => (
        <Post {...post} key={`post-${post.id}`} />
      ))}
    </div>
  );
}
