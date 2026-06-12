"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import HeroScene from "@/components/three/HeroScene";
import { profile } from "@/lib/data";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.set(".hero-fade", { y: 24, opacity: 0 });

      let tl: gsap.core.Timeline | undefined;
      let readyFired = false;
      const onReady = () => {
        readyFired = true;
        tl?.play();
      };
      window.addEventListener("workshop:ready", onReady, { once: true });
      const fallback = setTimeout(onReady, 3500);

      document.fonts.ready.then(() => {
        if (!el.isConnected) return;
        const h1 = el.querySelector("h1");
        if (!h1) return;

        const split = new SplitText(h1, {
          type: "lines,chars",
          linesClass: "line",
        });
        gsap.set(split.chars, { yPercent: 115 });
        gsap.set(h1, { opacity: 1 });

        tl = gsap
          .timeline({ paused: true })
          .to(split.chars, {
            yPercent: 0,
            stagger: 0.02,
            duration: 1.05,
            ease: "power4.out",
          })
          .to(
            ".hero-fade",
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.9,
              ease: "power3.out",
            },
            "-=0.55",
          );

        if (readyFired) tl.play();
      });

      return () => {
        clearTimeout(fallback);
        window.removeEventListener("workshop:ready", onReady);
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-svh min-h-[640px] flex-col justify-center overflow-hidden"
    >
      <HeroScene />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <p className="hero-fade label-mono mb-6">
          <span className="text-accent">●</span> the digital workshop of{" "}
          {profile.name}
        </p>

        <h1 className="split-clip font-display text-[clamp(3.2rem,11vw,9rem)] font-medium leading-[0.92] tracking-tight opacity-0">
          F*ck around<span className="text-accent">,</span>
          <br />
          Find out<span className="text-accent">.</span>
        </h1>

        <p className="hero-fade mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
          Fullstack engineer. Building the things I wish existed.
        </p>

        <p className="hero-fade mt-6 font-mono text-xs leading-relaxed text-faint">
          tip: this site has a working console.{" "}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("workshop:console"))
            }
            className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
          >
            open it
          </button>{" "}
          or press{" "}
          <kbd className="border border-line px-1.5 py-0.5 text-ink">`</kbd>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-6 md:p-10">
        <span className="hero-fade label-mono">scroll to enter ↓</span>
        <span className="hero-fade annotation hidden md:inline">
          fig. 0 - graph paper, comes alive. drag your cursor through it.
        </span>
      </div>
    </section>
  );
}
