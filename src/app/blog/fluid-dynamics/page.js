"use client";

import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import githubGist from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";
import { useEffect, Suspense } from "react";
import FluidSimulation from "./fluid-simulation";
import LatticeBoltzmann from "@/components/lattice-boltzmann";
import PDFViewer from "@/components/pdf-viewer";

export default function FluidDynamics() {
  return (
    <div className={s.articleContainer}>
      <div className={s.fluidBackgroundContainer}>
        <FluidSimulation />
      </div>
      <div className={s.articleInner}>
        <div className={s.articleSection}>
          <LatticeBoltzmann />
        </div>
        <div className={`${s.articleTitle} ${s.fluidDynamicsTitle}`}>
          Checking in with the fluid dynamicists (and some light grmhd)
        </div>
        {/* Fluid dynamics is one of the most beautiful areas of physics for those who can open themselves up to the flow,
          its the most natural realisation of a completely endemic property of our universe. The weather flows like the river flows like the merging of black
          holes flows like the electrical firings of a nervous system flows like brain waves flow. Okay not all of them
          just flow the same, but the point is there are invariably governing equations that detail the dynamics of the
          evolution of systems that are composed of the same atomic ancestors that find themselves dancing to different
          melodies and certain invariants in the space of dance moves correspond to physically realisable
          configurations.  */}
        <div className={s.articleSection}>
          Fluid dynamics is one of the most beautiful areas of physics one can encounter, its the most natural
          realisation of a completely endemic property of our universe. The weather flows like rivers flow like merging
          black holes flow like potentials in a nervous system flow like brain waves flow. Okay not all of them flow the
          same, but point is there are invariably governing equations that detail the dynamical evolution of seemingly
          different systems that are composed of the same atomic ancestors that just so happen to find themselves
          dancing to different melodies - and certain invariants in the space of dance moves correspond to physically
          realisable configurations.
          <br />
          <br />
          Its also quite eerie studying this stuff and seeing just how much psychology can be interpreted as a
          manifestation of basic numerical analysis (i.e if you want to <i>feel</i> what its like to diverge as a result
          of the Courant-Friedrichs-Lewy condition just try thinking faster / broader and assess the difference in
          phenomenology). Anyways, fluid dynamics is basically just the study of this one single equation:
        </div>
        <Latex>{String.raw`
$$
\rho \left( \ \underbrace{\partial_t{\mathbf{u}}}_{\text{Variation}} + \underbrace{(\mathbf{u} \cdot \nabla) \mathbf{u}}_{\text{Convective acceleration}} \ \right) = \underbrace{-\nabla p}_{\text{Pressure gradient}} + \underbrace{\mu \nabla^2 \mathbf{u}}_{\text{Viscous diffusion}} + \underbrace{\mathbf{f}}_{\text{Body forces}}
$$
`}</Latex>

        <div className={s.articleSection}>
          The incompressible Navier-Stokes equation, named after 2 brainiacs who figured it all out 3 centuries ago,
          where <Latex>{String.raw`$\mathbf{u}$`}</Latex> is the <b>flow velocity</b> and describes the motion of the
          entire continuous media (also called drift velocity in EM), <Latex>{String.raw`$\rho$`}</Latex> the density,{" "}
          <Latex>{String.raw`$\mu$`}</Latex> the dynamic viscosity coefficient and{" "}
          <Latex>{String.raw`$\mathbf{f}$`}</Latex> gravity plus any other external force. Note the lack of particles,
          we're in continuum mechanics territory and hence strictly deal with continuums.
        </div>
        <div
          className={`${s.articleSection} flex items-center justify-center justify-items-center grid-cols-2  gap-[30px]`}
        >
          <div className="h-full relative text-center flex flex-col align-self-end">
            <Image
              src="/fluid-dynamics/navier.png"
              width={250}
              height={340}
              alt="navier"
              className=" object-contain rounded-[5px] mb-[10px] "
            />
            <Latex>{String.raw`$\text{Navier (stoked)}$`}</Latex>
          </div>
          <div className="h-full relative text-center">
            <Image
              src="/fluid-dynamics/stokes.png"
              width={250}
              height={340}
              alt="stokes"
              className=" object-contain rounded-[5px] mb-[10px]"
            />
            <Latex>{String.raw`$\text{Stokes (not stoked)}$`}</Latex>
          </div>
        </div>
        <div className={s.articleSection}>
          There's many ways of actually simulating this evolution for a given set of initial conditions and all of them,
          to a first approximation, follow the same basic procedure: take a discrete step forward in time, separately
          apply the contribution to force given by advection / viscous diffusion / other forces, remove the divergences
          which were neccessarily created in the previous step by subtracting certain (gradients of) pressure fields
          which are pretty much defined to be vector fields that fix the divergence (via helmholtz-hodge, assuming the
          boundary is differentiable), rinse and repeat. One finds those pressure fields by reframing the problem as a
          poisson-equation whose solutions admit those pressure fields. This is computed iteratively (often with
          jacobi's method) and is inexpensive on the GPU. Though if you're restricted to a small number of frame buffers
          you may run into some issues converging, as is the case in shaertoy. (I actually used Lattice-Boltzmann for
          the Kármán Vortices above, <b>not</b> Joe-Stammian, they're different implementations but roughly live in the
          same conceptual neighbourhood)
          {/* </div>

        <div className={s.articleSection}>
          // put python code samples and outputs of lattice boltzmann sims vs joe stammian sims
        </div>

        <div className={s.articleSection}> */}
          <br />
          <br />
          There are other considerations like 'what do the walls mean?' with answers given in the form of boundary
          conditions. The primary ones being no-slip and periodic. The former is a dirichlet boundary condition that
          encapsulates the observation that when you graze your hand over honey, the honey at the very surface of your
          hand has zero velocity (or 'viscous fluids have zero bulk velocity'). The latter asserts the walls to be like
          pacman portals.
        </div>

        <div className={`${s.articleSection} flex justify-center items-center gap-[60px] !pb-[15px]`}>
          <div className="align-self-end w-auto  max-w-[300px] relative text-center">
            <Image
              src="/fluid-dynamics/noslip-vs-slip.png"
              width={250}
              height={340}
              alt="noslip vs slip boundary conditions"
              className=" w-auto object-contain grayscale rounded-[5px] mb-[10px]"
            />
            <Latex>{String.raw`$\text{No-Slip vs Slip BC}$`}</Latex>
          </div>
          <div className="align-self-end w-auto relative text-center">
            <Image
              src="/fluid-dynamics/periodic-boundary.png"
              width={250}
              height={340}
              alt="periodic boundary conditions"
              className="max-h-[130px] w-auto object-contain grayscale rounded-[5px] mb-[10px]"
            />
            <Latex>{String.raw`$\text{Periodic BC}$`}</Latex>
          </div>
        </div>
        {/* <div className={s.articleSection}>
          As per usual on this blog, we shall leave a comprehensible description and foundational motivation as an
          exercise to the webcrawler and move swiftly on to what matters most. Pretty simulations:
        </div> */}

        {/* <div className={s.articleSection}>
          // some beautiful fluid simulations, perhaps in 3d, doesn't really matter if they're actually computed or just
          videos etc
        </div> */}

        <div className={s.articleSection}>
          Some more beautiful and less understandable visuals arise from the field of computational relativistic
          magnetohydrodynamics, which studies plasma (and other electrically conducting fluids) travelling at
          relativistic speeds. Its the sledgehammer for the biggest nail's cosmology has to offer (relativistic jets,
          neutron star mergers, gamma ray bursts etc) with a formidable set of coupled nonlinear pde's that govern the
          interaction of the fluid with the electromagnetic field in curved spacetime:
        </div>

        <div className={s.articleSection}>
          <Latex>{String.raw`$$
\begin{alignat*}{}
\text{Mass conservation} & \qquad  \nabla_\mu (n u^\mu) = 0 \\[1em]
\text{Energy-momentum conservation} & \qquad  \nabla_\mu T^{\mu\nu} = 0 \\[1em]
\text{Stress-energy tensor} & \qquad T^{\mu\nu} = (\rho + u + p)u^\mu u^\nu + pg^{\mu\nu} + b^2u^\mu u^\nu + \tfrac{b^2}{2}g^{\mu\nu} - b^\mu b^\nu \\[1em]
\text{Maxwell (with sources)} & \qquad  \nabla_\nu F^{\mu\nu} = J^\mu \\[1em]
\text{Maxwell (no monopoles)} & \qquad  \nabla_\nu F^{*\mu\nu} = 0 \\[1em]
\text{Perfect conductivity} & \qquad  F^{\mu\nu}u_\nu = 0 \\[1em]
\text{Equation of state} & \qquad p = (\Gamma - 1)u 
\end{alignat*}
$$`}</Latex>
        </div>

        <div className={s.articleSection}>
          for <Latex>{String.raw`$n$`}</Latex> number density, <Latex>{String.raw`$u^\mu$`}</Latex> four-velocity,{" "}
          <Latex>{String.raw`$\rho$`}</Latex> rest-mass density, <Latex>{String.raw`$p$`}</Latex> pressure,{" "}
          <Latex>{String.raw`$u$`}</Latex> internal energy, <Latex>{String.raw`$b^\mu$`}</Latex> magnetic field
          four-vector, <Latex>{String.raw`$F^{\mu\nu}$`}</Latex> EM field tensor, <Latex>{String.raw`$J^\mu$`}</Latex>{" "}
          four-current, <Latex>{String.raw`$\Gamma$`}</Latex> is 4/3 or 5/3 for ultra-relativistic and non-relativistic
          speeds respectively.
          <br />
          <br />
          As per usual on this blog, we shall leave a comprehensible description and foundational motivation as an
          exercise to the webcrawler and move swiftly on to what matters most. Pretty simulations. Unfortunately one
          needs a supercomputer to solve these guys numerically and the University Of Cambridge has yet to return any of
          my 372 emails requesting a free codesandbox hosted on their{" "}
          <a
            href="https://docs.hpc.cam.ac.uk/hpc/user-guide/policies.html?utm_source=chatgpt.com#service-level-4-residual-usage"
            className="text-sky-500"
            target="_blank"
          >
            4256 CPU core compute cluster
          </a>{" "}
          so we shall have to make do with gawking at arxiv's most recent:
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2410.02852v1/2410.02852v1.pdf" />
          </div>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2410.02852v1/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
            <Image
              src="/fluid-dynamics/2410.02852v1/1.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit  min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2410.02852v1}}$`}</Latex>
            </a>
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2410.08280v1/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
            <Image
              src="/fluid-dynamics/2410.08280v1/1.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit  min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2410.08280v1}}$`}</Latex>
            </a>
          </div>
          <div className="max-w-[50%] min-w-[48%] h-full">
            <PDFViewer url="/fluid-dynamics/2410.08280v1/2410.08280v1.pdf" />
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2410.10944v2/2410.10944v2.pdf" />
          </div>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2410.10944v2/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="https://arxiv.org/pdf/2410.10944v2" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2410.10944v2}}$`}</Latex>
            </a>
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2411.02515v1/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="https://arxiv.org/pdf/2411.02515v1" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2411.02515v1}}$`}</Latex>
            </a>
          </div>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2411.02515v1/2411.02515v1.pdf" />
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2411.09556v3/2411.09556v3.pdf" />
          </div>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2411.09556v3/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="https://arxiv.org/pdf/2411.09556v3" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2411.09556v3}}$`}</Latex>
            </a>
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2412.06492v3/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="https://arxiv.org/pdf/2412.06492v3" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2412.06492v3}}$`}</Latex>
            </a>
          </div>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2412.06492v3/2412.06492v3.pdf" />
          </div>
        </div>

        <div className={`${s.articleSection} relative flex max-h-[min(50vw,_550px)] h-[70vh] gap-[15px] !mb-[30px]`}>
          <div className="max-w-[50%] min-w-[50%] h-full">
            <PDFViewer url="/fluid-dynamics/2502.06389v1/2502.06389v1.pdf" />
          </div>
          <div className="w-full flex flex-col gap-[15px]">
            <Image
              src="/fluid-dynamics/2502.06389v1/0.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
            <Image
              src="/fluid-dynamics/2502.06389v1/1.png"
              width={250}
              height={340}
              alt="paper"
              className="w-auto h-auto object-inherit min-w-[0] min-h-[0] rounded-[5px]"
            />
          </div>
          <div className="absolute bottom-0 left-0 max-[960px]:text-center max-[960px]:bottom-[-10px] w-full">
            <a href="https://arxiv.org/pdf/2502.06389v1" target="_blank">
              <Latex>{String.raw`$\tiny{\textit{https://arxiv.org/pdf/2502.06389v1}}$`}</Latex>
            </a>
          </div>
        </div>

        <div className={s.articleSection}>
          {/* And by far the most mind blowing visuals come from Matthew Liska, a computational astrophysicist who casually
          posts the most extraordinary simulations humanity has ever produced alongside rock climbing videos to a
          shockingly low-viewed youtube channel. I haven't seen anything remotely similar, they're seriously beautiful: */}
          Isn't it all fascinating. Of particular note is the last papers author,{" "}
          <a className="text-sky-500" href="https://www.matthewliska.com/" target="_blank">
            Matthew Liska
          </a>
          , a computational astrophysicist who{" "}
          <a className="text-sky-500" href="https://www.youtube.com/channel/UCB2BslhkPMTkIicfoIBG0mQ" target="_blank">
            casually posts humanity's most advanced simulations on the most exotic phenomena to exist in the universe
          </a>{" "}
          alongside rock climbing videos on a fairly obscured youtube channel. They are beyond anything else I've seen
          and seriously beautiful. Its utterly remarkable that humans are capable of this, the magnitude of it all is
          often lost on me.
        </div>
        <div className={s.articleSection}></div>
      </div>
    </div>
  );
}
