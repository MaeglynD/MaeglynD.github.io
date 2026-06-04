"use client";

import Link from "next/link";
import s from "./home.module.css";

import { CloudMoon, CloudSun02 } from "untitledui-js-base";
import { useState, useCallback } from "react";

export default function Nav() {
  const [darkMode, setDarkMode] = useState(false);

  const themeHandler = useCallback(() => {
    document.body.classList.toggle("dark", darkMode);
    setDarkMode(!darkMode);
  }, [darkMode]);

  return (
    <div className={s.nav}>
      <Link href="/" className={s.me}>
        Maeglyn
      </Link>
      <div className={s.tabs}>
        <a href="https://www.abelian.shop/" target="_blank">
          store
        </a>

        <a href="https://github.com/maeglynd" target="_blank">
          github
        </a>

        <button onClick={themeHandler} className={s.themeBtn}>
          {darkMode && <CloudMoon size="20" />}
          {!darkMode && <CloudSun02 size="20" />}
        </button>
        {/* <Link href="/philosophy">motif</Link> */}
      </div>
    </div>
  );
}
