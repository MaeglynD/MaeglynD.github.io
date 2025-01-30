"use client";

import Link from "next/link";
import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import githubGist from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";
import SyntaxHighlighter from "react-syntax-highlighter";
import { _l3GBD1, _4f3SRN, _3dtSzN } from "./code-strs";
import { useState, useEffect, Suspense, useRef } from "react";

const shaders = [
  { id: "L3GBD1", src: _l3GBD1, author: "Smull" },
  { id: "4f3SRN", src: _4f3SRN, author: "TristanC" },
  { id: "3dtSzN", src: _3dtSzN, author: "Krakel" },
];

export default function BeautyOfShaderArt() {
  const videos = useRef([]);

  setTimeout(() => {
    if (videos.current.length && videos.current[0]) {
      videos.current[0].play();
    }
  }, 3000);

  return (
    <div className={s.articleContainer}>
      <div className={s.articleInner}>
        <div className={`${s.articleTitle} ${s.shaderArticle}`}>The beauty of shader art</div>

        {shaders.map(({ id, src, author }, i) => (
          <div className={s.shaderArtContainer} key={id}>
            <div className={s.shaderArtSubContainer}>
              <div className={s.shaderVideoContainer} style={{ order: (i + 1) % 2 }}>
                <Suspense
                  fallback={
                    <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                  }
                >
                  <video
                    ref={(el) => (videos.current[i] = el)}
                    className={s.shaderVideo}
                    src={`/shader-art/${id}.mp4`}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => {
                      if (e.target.paused && !e.target.hasClicked) {
                        videos.current.forEach((x) => {
                          x.pause();
                        });

                        e.target.play();
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.hasClicked = false;
                    }}
                    onClick={(e) => {
                      e.target.paused ? e.target.play() : e.target.pause();
                      e.target.hasClicked = true;
                    }}
                  >
                    <source src="/shader-art/l3GBD1.mp4" type="video/mp4" />
                  </video>
                </Suspense>
              </div>
              <SyntaxHighlighter className={s.codeBlock} language="GLSL" style={githubGist}>
                {src}
              </SyntaxHighlighter>
            </div>
            <div className={s.shaderArtHeader}>
              <a href={`https://www.shadertoy.com/view/${id}`} target="_blank">
                <Latex>
                  {String.raw`$\mathcal{\because \ \ `}
                  {id}
                  {String.raw`\text{\ by `}
                  {author}
                  {String.raw` }\ \therefore}$`}
                </Latex>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
