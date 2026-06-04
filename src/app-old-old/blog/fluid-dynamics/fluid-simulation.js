"use client";
import { useEffect, useRef, useState } from "react";

export default function Fluid() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const script = document.createElement("script");
    script.src = "/fluid-dynamics/fluid.js";
    script.id = "fluid-sim-script";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.getElementById("fluid-sim-script")) {
        document.getElementById("fluid-sim-script").remove();
      }
    };
  }, [isVisible]);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <canvas id="fluid-simulation" className="w-full h-full opacity-[0.5]"></canvas>
    </div>
  );
}
