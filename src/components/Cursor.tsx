"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A small accent dot with a trailing ring. The ring swells over anything
 * interactive. Hidden entirely on touch devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useGSAP(
    () => {
      if (!enabled || !dotRef.current || !ringRef.current) return;

      const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power2.out" });
      const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power2.out" });
      const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3.out" });

      const move = (e: MouseEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const over = (e: MouseEvent) => {
        const interactive = (e.target as HTMLElement).closest(
          "a, button, [data-cursor]"
        );
        gsap.to(ringRef.current, {
          scale: interactive ? 2.4 : 1,
          opacity: interactive ? 0.9 : 0.5,
          duration: 0.3,
        });
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseover", over);
      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseover", over);
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-50"
      />
    </>
  );
}
