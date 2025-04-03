"use client";

import Link from "next/link";
import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function VisualisingHydrogen() {
  return (
    <div className={s.articleContainer}>
      <div className={s.articleInner}>
        <div className={s.articleTitle}>God I love wikipedia so god damn much</div>
        <div className={s.articleSection}>
          <div className={s.wikiExcerpt}>
            On 20 September 1996, at the age of 83, he had a heart attack and died while attending a conference in
            Warsaw. These circumstances were close to the way he wanted to die. He once said:
            <div className={s.wikiQuote}>
              I want to be giving a lecture, finishing up an important proof on the blackboard, when someone in the
              audience shouts out, 'What about the general case?'. I'll turn to the audience and smile, 'I'll leave that
              to the next generation,' and then I'll keel over.{" "}
            </div>
            <a className={s.wikiLink} href="https://wikipedia.org/wiki/Paul_Erdos" target="_blank">
              https://en.wikipedia.org/wiki/Paul_Erdos
            </a>
          </div>
        </div>

        {/* <div className={s.articleSection}>
          <div className={s.wikiExcerpt}>
            <div className={s.wikiExcerptSub}>
              Other idiosyncratic elements of Erdős's vocabulary include:
              <div className={s.br} />
              <ul>
                <li>
                  Children were referred to as "epsilons" (because in mathematics, particularly calculus , an
                  arbitrarily small positive quantity is commonly denoted by the Greek letter (ε)).
                </li>
                <li>
                  Women were "bosses" who "captured" men as "slaves" by marrying them. Divorced men were "liberated".
                </li>
                <li>People who stopped doing mathematics had "died", while people who died had "left".</li>
                <li>Alcoholic drinks were "poison".</li>
                <li>Music (except classical music) was "noise".</li>
                <li>To be considered a hack was to be a "Newton".</li>
                <li>To give a mathematical lecture was "to preach".</li>
                <li>Mathematical lectures themselves were "sermons".</li>
                <li>To give an oral exam to students was "to torture" them.</li>
              </ul>
              He gave nicknames to many countries, examples being: the U.S. was "samland" (after Uncle Sam) and the
              Soviet Union was "joedom" (after Joseph Stalin). He claimed that Hindi was the best language because words
              for old age (bud̩d̩hā) and stupidity (buddhū) sounded almost the same.
            </div>
            <a className={s.wikiLink} href="https://wikipedia.org/wiki/Paul_Erdos" target="_blank">
              https://en.wikipedia.org/wiki/Paul_Erdos
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
