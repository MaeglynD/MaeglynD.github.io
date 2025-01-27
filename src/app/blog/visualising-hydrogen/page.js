"use client";

import Link from "next/link";
import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { wavefunctionJs, wavefunctionPy, sphericalHarmonicsPy } from "./code-strs.js";
import { Sandpack } from "@codesandbox/sandpack-react";
import { sandpackCfg } from "../utils";
import SyntaxHighlighter from "react-syntax-highlighter";
import githubGist from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";
import dynamic from "next/dynamic";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WavefunctionPlot = dynamic(() => import("./plots").then((m) => m.WavefunctionPlot), {
  ssr: false,
  loading: () => <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />,
});

const LegendrePlot = dynamic(() => import("./plots").then((m) => m.LegendrePlot), {
  ssr: false,
  loading: () => <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />,
});

const LaguerrePlot = dynamic(() => import("./plots").then((m) => m.LaguerrePlot), {
  ssr: false,
  loading: () => <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />,
});

export default function VisualisingHydrogen() {
  return (
    <div className={s.articleContainer}>
      <div className={s.articleInner}>
        <div className={s.articleTitle}>
          Visualising hydrogenic energy eigenfunctions, spherical harmonics and time-dependent oscillating orbitals
        </div>
        <div className={s.articleSectionWide}>
          <div className={s.sandpackWrapper}>
            <Sandpack
              {...sandpackCfg}
              files={{
                "/index.js": wavefunctionJs,
              }}
            />
          </div>
        </div>
        <div className={s.articleSection}>
          <i>Warning: light serving of math jargon. All interactive visuals should have code attached. Enjoy.</i>
          <div className={s.lineBreak} />
          Our goal: find the position-space representation of the wavefunction for an electron some radial distance{" "}
          <Latex>{`${String.raw`$\vec{r}$`}`}</Latex> away from the nucleus in a non-relativistic hydrogen-like atom in
          a spherically symmetric Coulomb potential and milk it for all the pretty visuals we can get.
        </div>

        <WavefunctionPlot className={s.wavefunctionPlot} />
        <div className={s.articleSection}>
          That is, we seek solutions to the time-independent schrödinger equation where the Hamiltonian is the radial
          kinetic energy operator plus Coulomb electrostatic potential energy operator between a proton and electron:
        </div>
        <Latex>{String.raw`$$ \hat{H}\psi = E\psi$$`}</Latex>
        <Latex>{String.raw`$$\left( -\frac{\hbar^2}{2\mu} \nabla^2 + V \right)\psi = E\psi$$`}</Latex>
        <div className={s.articleSection}>Re-writing in spherical coordinates:</div>
        <Latex>{String.raw`$$ \left(-\frac{\hbar^{2}}{2m}\left\lbrack\frac{1}{r^{2}}\frac{\partial}{\partial r}\left(r^2\frac{\partial}{\partial r}\right)+\frac{1}{r^{2}\sin\theta}\frac{\partial}{\partial\theta}\left(\sin\theta\frac{\partial}{\partial\theta}\right)+\frac{1}{r^{2}\sin^{2}\theta}\frac{\partial^{2}}{\partial\phi^{2}}\right\rbrack+V\right)\psi=E\psi.$$`}</Latex>
        <div className={s.articleMain}>
          <div className={s.articleSection}>
            <i>
              As an aside, the angular (latter) part of the laplacian can be re-written as{" "}
              <Latex>{String.raw`$-\hat{L^2}/r^2\hbar^2$`}</Latex> where <Latex>{String.raw`$\hat{L^2}$`}</Latex> is the
              angular momentum operator. Spherical harmonics are eigenfunctions of said operator.
              <Latex>{String.raw` $ \ \hat{L^2}$`}</Latex> is also formally a <b>Casimir</b> operator of the Lie algebra
              <Latex>{String.raw` $\ \mathfrak{so}(3)$`}</Latex> associated with the Lie group{" "}
              <Latex>{String.raw`$\ \mathrm{SO}(3)$`}</Latex>.
            </i>
          </div>
          <div className={s.articleSectionWide}>
            <div className={s.sphericalSection}>
              <Latex>{String.raw`$$\begin{aligned}
\hat{L^2} &= -r^2 \nabla^2 + \left( r \frac{\partial}{\partial r} + 1 \right) r \frac{\partial}{\partial r} \\\\
          &= -\frac{1}{\sin\theta} \frac{\partial}{\partial\theta} \sin\theta \frac{\partial}{\partial\theta} - \frac{1}{\sin^2\theta} \frac{\partial^2}{\partial\varphi^2}, \\\\
L_z       &= -i \frac{\partial}{\partial\varphi}.
\end{aligned}$$`}</Latex>

              <Image
                className={s.articleImg}
                src="/hydrogen/spherical-coords.png"
                width={500}
                height={500}
                alt="placeholder"
              />
            </div>
          </div>
          <div className={s.articleSection}>
            <i>
              Ignoring spin (a coward's move, I know), the operators{" "}
              <Latex>{String.raw`$ \{ \hat{H},  \hat{L^2},  L_z \} $`}</Latex> form a CSCO for{" "}
              <Latex>{String.raw`$L^2(\mathbb R \times S^2) \simeq L^2(\mathbb R^3)$`}</Latex>, and these eigenfunctions
              shall satisfy the following eigenvector/value equations:
            </i>
          </div>
          <Latex>{String.raw`$$ \hat{H}\psi = E_n\psi, \quad \hat{L^2}\psi = l(l+1)\hbar^2\psi, \quad L_z\psi = m\hbar $$`}</Latex>
          <div className={s.articleSection}>
            <i>That is, unique states will be of the form:</i>
          </div>
          <Latex>{String.raw`$$ \braket{r,\theta,\phi|n,l,m} = \psi_{nlm}(r,\theta,\phi)$$`}</Latex>
          <div className={s.articleSection}>
            Now, assume <Latex>{String.raw`$\psi$`}</Latex> takes the separable form:{" "}
          </div>
          <Latex>{String.raw`$$ \psi(r,\theta,\phi) = R(r)Y(\theta,\phi) $$`}</Latex>
          <div className={s.articleSection}>
            A product of <b>radial</b> and <b>angular</b> parts respectively. Slam that guy into schrodinger and
            ansatz's <Latex>{String.raw`$l(l+1)$`}</Latex> as a separation constant:
          </div>
          <Latex>{String.raw`$$\left(\frac{1}{R}\frac{\partial}{\partial r}\left(r^2\frac{\partial}{\partial r}\right)R-\frac{2mr^{2}}{\hbar^{2}}\left[V-E\right]\right)+\left(\frac{1}{Y\sin\theta}\frac{\partial}{\partial\theta}\left(\sin\theta\frac{\partial}{\partial\theta}\right)Y+\frac{1}{Y\sin^2\theta}\frac{\partial^{2}}{\partial\phi^{2}}Y\right)=0.$$`}</Latex>
          <Latex>{String.raw`$$
\begin{aligned}
\frac{1}{R} \frac{d}{dr} \left( r^2 \frac{d}{dr} \right) R 
- \frac{2mr^2}{\hbar^2} \left[ V - E \right] &= l(l+1), \\\\
\frac{1}{Y \sin\theta} \frac{\partial}{\partial\theta} 
\left( \sin\theta \frac{\partial}{\partial\theta} \right) Y 
+ \frac{1}{Y \sin^2\theta} \frac{\partial^2}{\partial\phi^2} Y 
&= -l(l+1).
\end{aligned}
$$`}</Latex>
          <div className={s.articleSection}>
            Once again, assume <Latex>{String.raw`$Y(\theta, \phi)$`}</Latex> seperates into{" "}
            <Latex>{String.raw`$f(\theta)g(\phi)$`}</Latex> and, after some moderate suffering which i'm too lazy to
            LaTeX out, one arrives at:
          </div>
          <Latex>{String.raw`$$ g(\phi) = e^{im\phi}, \quad f(\cos\theta) = P_{l,m}(\cos\theta) $$`}</Latex>
          <div className={s.articleSection}>
            where <Latex>{String.raw`$P_{l,m}(x)$`}</Latex> are associated Legendre polynomials, themselves being
            polynomials of unassociated legendre polynomials <Latex>{String.raw`$P_{l}(x)$`}</Latex>
          </div>

          <LegendrePlot className={s.plotWrapper} />
          <Latex>{String.raw`$$P_{l,m}(x)=(-1)^m\sqrt{(1-x^2)^m}\frac{d^m}{dx^m}P_l(x), \quad P_l(x)=\frac{(-1)^l}{2^ll!}\frac{d^l}{dx^l}(1-x^2)^l.$$`}</Latex>
          <div className={s.articleSection}>
            {" "}
            Putting it together, we arrive at spherical harmonics, which admit particularly beautiful visualisations:
          </div>
          <div className={`${s.articleSectionWide} ${s.harmonicSection}`}>
            <div className={s.harmonics}>
              <Image
                className={s.articleImg}
                src="/hydrogen/spherical-harmonic-5-0.png"
                width={1000}
                height={1000}
                alt="placeholder"
              />
              <Image
                className={s.articleImg}
                src="/hydrogen/spherical-harmonic-8-6.png"
                width={1000}
                height={1000}
                alt="placeholder"
              />
              <Image
                className={s.articleImg}
                src="/hydrogen/spherical-harmonic-6-5.png"
                width={1000}
                height={1000}
                alt="placeholder"
              />

              <Image
                className={s.articleImg}
                src="/hydrogen/spherical-harmonic-8-8.png"
                width={1000}
                height={1000}
                alt="placeholder"
              />
            </div>

            <SyntaxHighlighter className={s.codeBlock} language="python" style={githubGist}>
              {sphericalHarmonicsPy}
            </SyntaxHighlighter>
          </div>
          <Latex>{String.raw`$$Y_{l,m}(\theta,\phi)=(-1)^m\sqrt{\frac{(2l+1)(l-m)!}{4\pi(l+m)!}}P_{l,m}(\cos\theta)e^{im\phi}$$`}</Latex>
          <div className={s.articleSection}>
            With normalization factor (sign and radical) to enforce orthonormality, which is important for reasons we'll
            pretend are obvious. Moving onto the radial solution, we first note that it too is given in terms of a
            polynomial named after a dead french guy who's name begins with L. Interestingly, one was born the same year
            the other died, which is quite a shame if you consider the kind of polynomials they could have gone on to
            associate together:
          </div>
          <Latex>{String.raw`$$R_{n,l}(r)=Ne^{-r/na_0}\left(\frac{2r}{na_0}\right)^{l}L_{n-l-1}^{2l+1}\left(\frac{2r}{na_0}\right)$$`}</Latex>
          <div className={s.articleSection}>
            where <Latex>{String.raw`$L_{n}^{\alpha}(x)$`}</Latex> are associated Laguerre polynomials,{" "}
            <Latex>{String.raw`$N$`}</Latex> a normalisation constant:
          </div>
          <Latex>{String.raw`$$
L_n^{(\alpha)}(x) = \sum_{i=0}^n (-1)^i \binom{n+\alpha}{n-i} \frac{x^i}{i!}, \quad 
N = \sqrt{\left( \frac{2}{n a_0} \right)^3 \frac{(n-l-1)!}{2n \left( \left( n+l \right)! \right)^3}}.
$$`}</Latex>
          <LaguerrePlot className={s.plotWrapper} />
          <div className={s.articleSection}>
            Ok, terrific. Now, taking our first step out of this steaming pile of equations, what are we left with? A
            function that gives us the probability of finding an electron in some region in a hydrogen atom:
          </div>
          <Latex>{String.raw`$$ \int_{\Delta\Omega}\left|\psi_{nlm}\right|^2d\Omega=\int_{\Delta r}^{}\int_{\Delta\theta}^{}\int_{\Delta\phi}^{}\left|\psi_{nlm}(r,\theta,\phi)\right|^2r^2\sin\theta  dr  d\theta  d\phi\ $$`}</Latex>
          <div className={s.articleSection}>
            Finally, substituting in dimensionless units, the position-space representation of our solution is:
          </div>
          <Latex>{String.raw`
$$ \psi_{n\ell m}(r,\theta,\varphi)=\sqrt{\left(\frac{2}{na_{0}^{*}}\right)^{3}\frac{(n-\ell-1)!}{2n(n+\ell)!}}\mathrm{e}^{-\rho/2}\rho^{\ell}L_{n-\ell-1}^{2\ell+1}(\rho)Y_{\ell}^{m}(\theta,\varphi)$$`}</Latex>
          <div className={s.articleSection}>Where</div>
          <Latex>{String.raw`$$
  \rho =\frac{2r}{na_0^{*}}, \quad
  a_0^{*}=\frac{4\pi\varepsilon_0\hbar^2}{\mu e^2}, \quad 
  \mu = \frac{m_{e}m_{nuc}}{m_{e} + m_{nuc}}

$$`}</Latex>
          <div className={s.articleSection}>
            <Latex>{String.raw`$ a_0  $`}</Latex> bohr radius, <Latex>{String.raw`$ \epsilon_0  $`}</Latex> vacuum
            permittivity, <Latex>{String.raw`$ \hbar  $`}</Latex> reduced plank and <Latex>{String.raw`$m_e$`}</Latex>,{" "}
            <Latex>{String.raw`$m_{nuc} $`}</Latex> electron and nucleus mass respectively. Satisfying orthonormality:
          </div>
          <Latex>{String.raw`$$\int_{\Omega}\psi_{n\ell m}^{*}\psi_{n^{\prime}\ell^{\prime}m^{\prime}}d\Omega=\delta_{nn^{\prime}}\delta_{\ell\ell^{\prime}}\delta_{mm^{\prime}}$$`}</Latex>
          <div className={s.articleSectionWide}>
            <div className={s.codeblockWrapper}>
              <div className={s.leftSection}>
                <SyntaxHighlighter className={s.codeBlock} language="python" style={githubGist}>
                  {wavefunctionPy}
                </SyntaxHighlighter>
              </div>
              <div className={s.rightSection}>
                <Image
                  className={s.articleImg}
                  src="/hydrogen/7-2-2-xy.png"
                  width={429}
                  height={429}
                  alt="placeholder"
                />
                <Image
                  className={s.articleImg}
                  src="/hydrogen/7-2-2-xz.png"
                  width={429}
                  height={429}
                  alt="placeholder"
                />
                <Image
                  className={s.articleImg}
                  src="/hydrogen/7-2-2-yz.png"
                  width={429}
                  height={429}
                  alt="placeholder"
                />
              </div>
            </div>
          </div>
          <div className={s.articleSection}>
            The next update we'll include visuals on adding in time-dependence and (hopefully) see oscillations
            proportional in frequency to the energy difference of the modes:
          </div>
          <Latex>{String.raw`$$ \Psi(t)=c_1\psi_{n_1\ell_1m_1}e^{-iE_{n_1}t/\hbar}+c_2\psi_{n_2\ell_2m_2}e^{-iE_{n_2}t/\hbar} $$`}</Latex>
        </div>
      </div>
    </div>
  );
}
