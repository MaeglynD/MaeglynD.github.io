"use client";

import Link from "next/link";
import Image from "next/image";
import s from "./blog.module.css";
import { gruvboxColors } from "./utils";

function Post({ id, title, desc, tags, thumb, href, date }) {
  return (
    <Link className={s.post} href={href}>
      <div className={s.dateContainer}>{date}</div>
      <div className={s.txtContainer}>
        <div className={s.title}>{title}</div>
        <div className={s.desc}>{desc}</div>
        <div className={s.tags}>
          {tags.map((tag, i) => (
            <div
              className={`${s.tag} ${s[tag]}`}
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
  {
    id: 0,
    date: "Jan. 25, 2025",
    title: "Fourier Transforms, Fourier Optics, Fourier Neural Operators and Fourier Island",
    desc: "I've never been a big fan of the spatial domain",
    tags: ["Math", "Optics", "Visualisation", "Functional analysis"],
    thumb: "/fourier/thumb.png",
    href: "/blog/fourier",
  },
  {
    id: 1,
    date: "Jan. 17, 2025",
    title: " Visualising hydrogenic energy eigenfunctions, spherical harmonics and time-dependent oscillating orbitals",
    desc: "Taking a tourists stroll through a derivation of the hydrogen-like wavefunction and programming / rendering simulations for fun along the way",
    tags: ["Math", "Python", "JS", "Visualisation", "Physics"].sort((a, b) => a.localeCompare(b)),
    thumb: "/hydrogen/thumb.png",
    href: "/blog/visualising-hydrogen",
  },
  {
    id: 2,
    date: "Jan. 2, 2025",
    title: "The beauty of shader art",
    desc: "Tryptamines? No thanks, I have a perfectly good inverseqrt, atan, smoothstep, mix, normalize, clamp, length, distance, dot, cross, reflect and refract at home",
    tags: ["WIP", "Art", "GLSL", "Shaders"],
    thumb: "/shader-art.png",
    href: "/blog/the-beauty-of-shader-art",
  },
  // {
  //   id: 3,
  //   title: "God I love wikipedia so much",
  //   desc: "I have a chronic wikipedia addiction and to keep this website from being txtdump of contextless excerpts I've opted for a containment zone.",
  //   tags: ["Math"],
  //   thumb: "/fluid-dynamics.png",
  //   href: "/blog/wikipedia-excerpts",
  // },

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
