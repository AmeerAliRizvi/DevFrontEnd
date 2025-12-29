// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function MergeGraphicSection() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const pieces = gsap.utils.toArray(".piece");

//     gsap.fromTo(
//       pieces,
//       {
//         x: () => gsap.utils.random(-200, 200),
//         y: () => gsap.utils.random(-200, 200),
//         opacity: 0,
//       },
//       {
//         x: 0,
//         y: 0,
//         opacity: 1,
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top center",
//           end: "bottom center",
//           scrub: true,
//         },
//         stagger: 0.05,
//         duration: 1.5,
//         ease: "power3.out",
//       }
//     );
//   }, []);

//   return (
//     <section
//       ref={containerRef}
//       style={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#0a0a0a",
//       }}
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 100px)",
//           gridTemplateRows: "repeat(3, 100px)",
//           gap: "0",
//         }}
//       >
//         {[...Array(9)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="piece"
//             style={{
//               width: "100px",
//               height: "100px",
//               background: `hsl(${i * 40}, 80%, 50%)`,
//               border: "1px solid white",
//             }}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
// MergeGraphicSection.jsx
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

// export default function MergeGraphicSection({ cols = 5, rows = 3, pieceSize = 96 }) {
//   const containerRef = useRef(null);
//   const piecesRef = useRef([]);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const pieces = gsap.utils.toArray(".merge-piece");
//       // initial scatter (random)
//       gsap.set(pieces, {
//         x: () => gsap.utils.random(-320, 320),
//         y: () => gsap.utils.random(-220, 220),
//         rotation: () => gsap.utils.random(-35, 35),
//         opacity: 0.95,
//       });

//       // merge on scroll
//       gsap.to(pieces, {
//         x: 0,
//         y: 0,
//         rotation: 0,
//         scale: 1,
//         opacity: 1,
//         ease: "power3.out",
//         stagger: { each: 0.04, from: "random" },
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top center+=80",
//           end: "bottom center",
//           scrub: 0.8,
//         },
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   // pieces array
//   const total = cols * rows;
//   const arr = Array.from({ length: total }, (_, i) => i);

//   return (
//     <section
//       ref={containerRef}
//       id="merge"
//       className="py-20 px-4 flex flex-col items-center bg-gradient-to-b from-black/0 to-black/40"
//     >
//       <div className="max-w-6xl w-full">
//         <h3 className="text-3xl font-bold text-center text-green-400 mb-3">Watch ideas merge</h3>
//         <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
//           Pieces fly together as you scroll — replace the colored tiles with your own sliced image later.
//         </p>

//         <div
//           className="mx-auto rounded-2xl overflow-hidden p-6"
//           style={{
//             width: cols * pieceSize + 48,
//             background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
//             border: "1px solid rgba(255,255,255,0.04)",
//           }}
//         >
//           <div
//             className="grid"
//             style={{
//               gridTemplateColumns: `repeat(${cols}, ${pieceSize}px)`,
//               gridTemplateRows: `repeat(${rows}, ${pieceSize}px)`,
//               gap: 6,
//             }}
//           >
//             {arr.map((i) => (
//               <div
//                 key={i}
//                 ref={(el) => (piecesRef.current[i] = el)}
//                 className="merge-piece will-change-transform"
//                 style={{
//                   width: pieceSize,
//                   height: pieceSize,
//                   borderRadius: 12,
//                   boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 {/* colored tile (replace with <img src={`/pieces/piece-${i+1}.png`} /> later) */}
//                 <div
//                   className="w-full h-full rounded-xl"
//                   style={{
//                     background: `linear-gradient(135deg, hsl(${(i * 50) % 360} 80% 55%), hsl(${(i * 50 + 60) % 360} 65% 45%))`,
//                     border: "1px solid rgba(255,255,255,0.04)",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// MergeGraphicSection.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function MergeGraphicSection({ cols = 5, rows = 3, pieceSize = 96 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray(".merge-piece");

      // initial scattered positions
      gsap.set(pieces, {
        x: () => gsap.utils.random(-320, 320),
        y: () => gsap.utils.random(-220, 220),
        rotation: () => gsap.utils.random(-35, 35),
        opacity: 0.95,
        scale: 0.98,
      });

      // merge animation controlled by scroll
      gsap.to(pieces, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        ease: "power3.out",
        stagger: { each: 0.04, from: "random" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center+=80",
          end: "bottom center",
          scrub: 0.8,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const total = cols * rows;
  const arr = Array.from({ length: total }, (_, i) => i);

  return (
    <section ref={containerRef} id="merge" className="py-20 px-4 flex flex-col items-center bg-gradient-to-b from-black/0 to-black/40">
      <div className="max-w-6xl w-full">
        <h3 className="text-3xl font-bold text-center text-green-400 mb-3">Signature Merge</h3>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          Pieces fly together as you scroll — replace colored tiles with sliced images later.
        </p>

        <div
          className="mx-auto rounded-2xl overflow-hidden p-6"
          style={{
            width: cols * pieceSize + 48,
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${pieceSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${pieceSize}px)`,
              gap: 6,
            }}
          >
            {arr.map((i) => (
              <div
                key={i}
                className="merge-piece will-change-transform"
                style={{
                  width: pieceSize,
                  height: pieceSize,
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  className="w-full h-full rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(i * 50) % 360} 80% 55%), hsl(${(i * 50 + 60) % 360} 65% 45%))`,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
