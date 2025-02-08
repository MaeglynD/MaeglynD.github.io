// "use client";

// import Image from "next/image";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import s from "./design.module.css";
// import { useState, Suspense } from "react";

// export default function Design() {
//   const [fullSrc, setFullSrc] = useState("");
//   return (
//     <>
//       <div className={`${s.full} ${fullSrc ? s.active : ""}`} onClick={() => setFullSrc("")}>
//         {fullSrc && (
//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="cursor-default data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
//             width={2384}
//             height={1500}
//             src={fullSrc}
//             onClick={(e) => e.stopPropagation()}
//             alt="frechet"
//           />
//         )}
//       </div>

//       <div className={s.designContainer}>
//         <div className={s.designInner}>
//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
//             width={2384}
//             height={1500}
//             src="/design/frechet.png"
//             alt="frechet"
//             onClick={() => setFullSrc("/design/frechet.png")}
//           />

//           <div className={s.designText}>
//             <div className={s.designTitle}>
//               <div>Fréchet [concept] </div>
//               <div className={s.designDate}> 2024</div>
//             </div>
//           </div>
//         </div>

//         <div className={s.designInner}>
//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
//             width={2384}
//             height={1500}
//             src="/design/niobium.png"
//             onClick={() => setFullSrc("/design/niobium.png")}
//             alt="frechet"
//           />

//           <div className={s.designText}>
//             <div className={s.designTitle}>
//               <div>Niobium [concept]</div>
//               <div className={s.designDate}> 2024</div>
//             </div>
//           </div>
//         </div>

//         <div className={s.designInner}>
//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
//             width={2384}
//             height={1500}
//             src="/design/misaki2.png"
//             onClick={() => setFullSrc("/design/misaki2.png")}
//             alt="frechet"
//           />
//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/90"
//             width={2384}
//             height={1500}
//             src="/design/misaki.png"
//             onClick={() => setFullSrc("/design/misaki.png")}
//             alt="frechet"
//           />

//           <div className={s.designText}>
//             <div className={s.designTitle}>
//               <div>Untitled </div>
//               <div className={s.designDate}> 2024</div>
//             </div>
//           </div>
//         </div>

//         {/* <div className={s.designInner}>
//           <Image
//           data-loaded="false"
//           onLoad={(e) => {
//             e.currentTarget.setAttribute("data-loaded", "true");
//           }}
//           className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100"
//           width={2384}
//           height={1500}
//           priority={true}
//           src="/design/abelian.png"
//           alt="frechet"
//         />

//           <Image
//             data-loaded="false"
//             onLoad={(e) => {
//               e.currentTarget.setAttribute("data-loaded", "true");
//             }}
//             className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100"
//             width={2384}
//             height={1500}
//             src="/design/abelian2.png"
//             onClick={() => setFullSrc("/design/abelian2.png")}
//             alt="frechet"
//           />
//           <div className={s.designText}>
//             <div className={s.designTitle}>
//               <div>Abelian</div>
//               <div className={s.designDate}> 2024</div>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </>
//   );
// }

"use client";

import Image from "next/image";
import s from "../home.module.css";
import Link from "next/link";

export default function Design() {
  return (
    <div className={s.container}>
      <div className={s.design}>
        <div className={s.header}>Design </div>

        <div className={s.designLinks}>
          <Link href="/design/frechet" className={s.designLink}>
            <Image className={s.designImg} src="/design/frechet-thumb.png" height={540} width={968} alt="thumb" />
            <div className={s.designTitle}>Fréchet</div>
            <div className={s.designDesc}>Conceptual beauty brand</div>
          </Link>

          <Link href="/design/bookmarker" className={s.designLink}>
            <Image className={s.designImg} src="/design/bookmarker-thumb.png" height={540} width={968} alt="thumb" />
            <div className={s.designTitle}>Bookmarker</div>
            <div className={s.designDesc}>Analytics, for bookmarks</div>
          </Link>

          <Link href="/design/niobium" className={s.designLink}>
            <Image className={s.designImg} src="/design/niobium-thumb.png" height={540} width={968} alt="thumb" />
            <div className={s.designTitle}>Niobium</div>
            <div className={s.designDesc}>Conceptual OS CFD software</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
