"use client";

import Link from "next/link";
import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import githubGist from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";
import { basicFFTSpectrum, inverseFFT } from "./code-strs";
import { Suspense } from "react";

export default function Fourier() {
  return (
    <div className={`${s.articleContainer} ${s.fourierArticle}`}>
      <div className={s.articleInner}>
        <div className={s.articleTitle}>
          Fourier Transforms, Fourier Optics, Fourier Neural Operators and Fourier Island
        </div>
        <div className={`${s.articleSection} ${s.fourierPictures}`}>
          <Suspense
            fallback={
              <>
                <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
              </>
            }
          >
            <Image
              className={s.articleImg}
              src="/fourier/fourier-great.png"
              width={230}
              height={500}
              alt="fourier"
              priority={true}
            />
            <Image
              className={s.articleImg}
              src="/fourier/fourier-less.png"
              width={230}
              height={500}
              alt="fourier"
              priority={true}
            />
            <Image
              className={s.articleImg}
              src="/fourier/fourier.png"
              width={230}
              height={500}
              alt="fourier"
              priority={true}
            />
          </Suspense>
        </div>
        <div className={s.articleSection}>
          Before any fouriering, consider the space <Latex>{String.raw`$L^2(\mathbb{R})$`}</Latex>, the space of nice
          functions. Every point is a function and every function can be decomposed in a basis of dirac delta's{" "}
          <Latex>{String.raw`$ \{ \delta_t : t \in \mathbb{R} \} \ $`}</Latex>
          with the property:
        </div>
        <Latex>{String.raw`$$f(s) = \int_{\mathbb{R}} f(t) \, \delta(s-t) \, dt.$$`}</Latex>
        <div className={s.articleSection}>
          Pretty neat right. Now, a direct path to realising fourier transforms is noticing that you can represent the
          <Latex>{String.raw`$ \ \delta_t$`}</Latex>'s as:
        </div>
        <Latex>{String.raw`$$\delta(x-t) = \frac{1}{2\pi} \int_{\mathbb{R}} e^{i\omega (x-t)} \, d\omega$$`}</Latex>

        <div className={s.articleSection}>Substituting:</div>
        <Latex>{String.raw`$$\begin{aligned}
f(s) &=\int_{\mathbb{R}}^{}f(t)\left[\frac{1}{2\pi}\int_{\mathbb{R}}^{}e^{i\omega(s-t)}d\omega\right]dt
\\ \\
&=\frac{1}{2\pi}\int_{\mathbb{R}}^{}e^{i\omega s} 
\underbrace{\left[\int_{\mathbb{R}}^{}f(t)e^{-i\omega t}dt\right]}_{\hat{f}(\omega)}
d\omega

\end{aligned}
$$`}</Latex>
        <div className={s.articleSection}>
          Where the interior integral is exactly the fourier transform of
          <Latex>{String.raw`$\ f$`}</Latex>:
        </div>
        <Latex>{String.raw`$$
\hat{f}(\omega)=\int_{\mathbb{R}}f(t)e^{-i\omega t}dt, \quad

f(s) =\frac{1}{2\pi}\int_{\mathbb{R}}\hat{f}(\omega)e^{i\omega s}d\omega
$$`}</Latex>
        <div className={s.articleSection}>
          {" "}
          And so we have two basis for our space. A frequency basis (with complex exponentials) that captures the kindof
          global frequency content of f and the position basis which is juxtaposedly somewhat infinitley localised. This
          is all immediately generalisable to higher dimensions:
        </div>

        <Latex>{String.raw`$$
\delta(\vec{s} - \vec{t}) = \frac{1}{(2\pi)^n} \int_{\mathbb{R}^n} e^{i\, \vec{\omega} \cdot (\vec{s}-\vec{t})} \, d\vec{\omega},

\quad

\vec{\omega} \cdot (\vec{s} - \vec{t}) = \sum_{n} \omega_j (s_j - t_j).

$$`}</Latex>

        <Latex>{String.raw`$$

\begin{aligned}
f(\vec{s}) &= \int_{\mathbb{R}^n} f(\vec{t})\, \delta(\vec{s} - \vec{t}) \, d\vec{t}

\\  

&= \frac{1}{(2\pi)^n} \int_{\mathbb{R}^n} e^{i\, \vec{\omega} \cdot \vec{s}} \left[\int_{\mathbb{R}^n} f(\vec{t})\, e^{-i\, \vec{\omega} \cdot \vec{t}} \, d\vec{t} \right] d\vec{\omega}
\end{aligned}
\\
$$`}</Latex>
        <Latex>{String.raw`$$

\\

\hat{f}(\vec{\omega}) = \int_{\mathbb{R}^n} f(\vec{t}) \, e^{-i\, \vec{\omega} \cdot \vec{t}} \, d\vec{t},
\quad

f(\vec{s}) = \frac{1}{(2\pi)^n} \int_{\mathbb{R}^n} \hat{f}(\vec{\omega}) \, e^{i\, \vec{\omega} \cdot \vec{s}} \, d\vec{\omega}
$$`}</Latex>

        <div className={s.articleSection}>
          How does this relate to image processing and optics? Images are just functions on an{" "}
          <Latex>{String.raw`$M \times N$`}</Latex> matrix that assigns some datum (3 values for RGB or 1 value for
          greyscale) to each element of said matrix (that could have been physically captured by photodiodes, say) and
          are no less impervious to fourier analysis. That is, every image can be decomposed into a sum of plane waves,
          of which, can be identified with vectors of the form <Latex>{String.raw`$e^{i2\pi(ux \ + \ uy)}$`}</Latex>{" "}
          where <Latex>{String.raw`$(u,v)$`}</Latex> are spatial frequencies:
        </div>
        <Latex>{String.raw`$$\hat{f}(u,v)=\sum_{m}^{}\sum_{n}^{}f(m,n)e^{-i2\pi\left(\frac{um}{M}+\frac{vn}{N}\right)}$$`}</Latex>

        <div className={`${s.articleSectionWide} ${s.fftSpectrumCodeBlock}`}>
          <SyntaxHighlighter className={s.codeBlock} language="python" style={githubGist}>
            {basicFFTSpectrum}
          </SyntaxHighlighter>
          <div className={s.fftSpectrumImgs}>
            <Image
              className={s.articleImg}
              src="/fourier/basic-y-phase.png"
              width={500}
              height={500}
              alt="placeholder"
            />
            <Image
              className={s.articleImg}
              src="/fourier/basic-x-phase.png"
              width={500}
              height={500}
              alt="placeholder"
            />
            <Image
              className={s.articleImg}
              src="/fourier/basic-sum-phase.png"
              width={500}
              height={500}
              alt="placeholder"
            />
          </div>
        </div>

        <div className={s.articleSection}>
          We're discretizing things so we call it the 'Discrete Fourier Transform' / DFT. Now, a fourier space
          representation of an image has 4 degrees of freedom (2D matrix with complex values), so it'll visually
          necessitates splitting into amplitude and phase. What if we zero out higher or lower frequencies and inverse
          FFT, effectively creating a quasi-aperture?:
        </div>

        <div className={`${s.articleSectionWide} ${s.ifftCodeBlock}`}>
          <SyntaxHighlighter className={s.codeBlock} language="python" style={githubGist}>
            {inverseFFT}
          </SyntaxHighlighter>
        </div>

        <div className={s.articleSectionIfftFlows}>
          <div className={s.ifftImgs}>
            <Suspense
              fallback={
                <>
                  <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                  <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                  <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                  <Skeleton containerClassName={s.skeletonLoaderContainer} className={s.skeletonLoader} count={1} />
                </>
              }
            >
              <Image src="/fourier/art-flow.png" width={1000} height={300} alt="fft flow" />
              <Image src="/fourier/art-flow-invert.png" width={1000} height={300} alt="fft flow" />
              <Image src="/fourier/constanza-flow.png" width={1000} height={300} alt="george constanza" />
              <Image src="/fourier/constanza-flow-invert.png" width={1000} height={300} alt="george constanza" />
            </Suspense>
          </div>
        </div>

        <div className={s.articleSection}>
          Blocking out high frequencies and inverse FFT'ing yields a blurry image while blocking out lower frequencies
          leaves only sharp sudden changes / finer details. This process is known as <b>low-pass</b> and{" "}
          <b>high-pass</b> filtering respectively and is a common technique in image processing. Two other remarkable
          properties of DFT's / FT's are:
        </div>
        <Latex>{String.raw`$$ \begin{aligned} 
        \text{Convolution Theorem}&: \quad \mathcal{F}\{f * g\}(\omega) = \mathcal{F}\{f\}(\omega) \cdot \mathcal{F}\{g\}(\omega),\\\\
 \text{Shift Theorem}&: \quad \mathcal{F}\{f(x-a)\}(\omega) = e^{-i2\pi a \omega} \, \mathcal{F}\{f\}(\omega)
\end{aligned}
$$
`}</Latex>
        <div className={s.articleSection}>
          Now, fascinatingly, in fourier optics one can (roughly speaking) set things up such that{" "}
          <b>a lens fourier transforms the ingoing light!</b> Okay, not exactly without clarification, so more
          technically if you have the following setup:
        </div>
        <div className={`${s.articleSection} ${s.lensSetup}`}>
          <Image src="/fourier/lens-setup.png" width={1000} height={100} alt="fourier lens setup" />
        </div>

        <div className={s.articleSection}>
          there's a particular distance (called the "focal distance") that defines a plane such that light rays that go
          into the lens parallel to each other are all sent to the exact same point on said plane after exiting the
          lens. If the backplate is put at this distance, then (under the assumptions of scalar diffraction theory and
          paraxial approximation) the complex light field over the backplate (the focal plane),{" "}
          <Latex>{String.raw`$U(u,v)$`}</Latex>, is given by:
        </div>
        <Latex>{String.raw`$$U(u,v)\propto\mathcal{F}\{A(x,y)\}(u,v)=\iint A(x,y)e^{-i2\pi(ux+vy)}dxdy$$`}</Latex>
        <div className={s.articleSection}>
          And the <b>intensity</b> of this field, <Latex>{String.raw`$I(u,v)$`}</Latex>, is given by:
        </div>
        <Latex>{String.raw`$$I(u,v)\propto |U(u,v)|^2$$`}</Latex>

        <div className={s.articleSection}>
          This is the{" "}
          <b>
            <a href="https://en.wikipedia.org/wiki/Fraunhofer_diffraction_equation" target="_blank">
              Fraunhofer diffraction pattern
            </a>
          </b>{" "}
          of the aperture. In microscopy, microscopes are setup in exactly this way, i think, which is why microscopes
          have finite spatial resolution. Higher fidelity, requires higher spatial frequencies. Whilst researching this
          I also came across one of{" "}
          <a target="_blank" href="https://github.com/rafael-fuente/diffractsim">
            the most beautiful simulation libraries I've ever seen
          </a>{" "}
          by{" "}
          <a href="https://github.com/rafael-fuente" target="_blank">
            Rafael Fuente:
          </a>
          <div className={s.simulationGifs}>
            <Image src="/fourier/gif2.gif" width={700} height={300} alt="diffraction simulation" />
          </div>
          Just watch{" "}
          <a href="https://www.youtube.com/watch?v=Ft8CMEooBAE" target="_blank">
            his video
          </a>{" "}
          all the way through, its mindblowing. If anyone knows where I can find more stuff like this please let me
          know. Isn't this cool? Alright next fourier.
        </div>

        <div className={`${s.articleSection} ${s.fourierNeuralOperators}`}>
          <Image src="/fourier/fourier-neural-operator.png" width={1000} height={100} alt="fourier neural operator" />
        </div>

        <div className={s.articleSection}>
          Fourier neural operators (FNO's) are neural nets that are of a more general class of "neural operators" (which
          are just neural nets that approximate maps between function spaces), each 'fourier layer' includes a trip to
          the frequency domain and back. Whilst there the net has an opportunity to scale some frequency components of
          the now-fourier-transformed input data using 'fourier multipliers'{" "}
          <Latex>{String.raw`$R_{\phi}(\omega)$`}</Latex>, different <Latex>{String.raw`$\phi$`}</Latex>'s give
          different scalings (that is, it <b>learns</b> the fourier multipliers). This is particularly cool because
          pointwise multiplication in the frequency domain affects the entirety of the spatial domain, so it gives the
          local an opportunity to change the global in a more unambiguously direct, uniform fashion:
        </div>

        <Latex>{String.raw`$$
v_{\text{new}}(x) = \sigma\Bigg[ (Wv)(x) + \mathcal{F}^{-1}\Big( R_\phi(\omega) \cdot \mathcal{F}(v)(\omega) \Big)(x) \Bigg]
$$
`}</Latex>

        <div className={s.articleSection}>
          <Latex>{String.raw`$R_{\phi}(\omega)$`}</Latex> learnable fourier multipliers,{" "}
          <Latex>{String.raw`$W$`}</Latex> spatial domain weight operator, <Latex>{String.raw`$\sigma$`}</Latex> some
          nonlinear activation. Now, we have finally arrived at the our last and most important fourier of them all:
          Fourier island. Wikipedia tells me that it is a beautiful island on the border antarctica named after a french
          guy. Not to be confused with <b>Fournier island</b>, also an island on the border of antarctica named by
          france.
        </div>

        <div className={s.fourierIslands}>
          <Image src="/fourier/fournier-island.png" width={500} height={500} alt="fournier island" />
          <Image src="/fourier/fourier-island.png" width={500} height={500} alt="fourier island" />
        </div>
      </div>
    </div>
  );
}
