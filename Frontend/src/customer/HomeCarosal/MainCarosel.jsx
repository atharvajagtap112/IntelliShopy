import { useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mainCarouselData as slides } from "./MainCaroselData";

// Split-screen editorial hero. The source banners have marketing type baked into
// the artwork, so overlaying a headline on top of them collides. Giving the copy
// its own solid panel fixes that and kills the centred-hero cliche at the same time.
const EASE = [0.16, 1, 0.3, 1];

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d="M1 6h9M6.5 2l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MainCarousel = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Once the visitor drives the hero themselves, autoplay stops for good. Otherwise
  // a slide advances on its own between them reaching for the arrow and clicking it,
  // and one click reads as a two-step jump.
  const [manual, setManual] = useState(false);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    []
  );

  const slide = slides[index];

  return (
    <section className="group/hero relative h-[640px] w-full overflow-hidden bg-zinc-950 md:h-[88vh] lg:grid lg:grid-cols-5">
      {/* ---------- Image half ---------- */}
      <div className="absolute inset-0 overflow-hidden lg:relative lg:inset-auto lg:col-span-3 lg:col-start-3 lg:row-start-1">
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: slide.focus || "center" }}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.14 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" },
            }}
          />
        </AnimatePresence>

        {/* Mobile only: the copy overlays the photo there, so it needs a scrim.
            Desktop keeps a hard gutter - the panel edge is the design. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-zinc-950/25 lg:hidden" />

        {/* Film grain - cheapest way to stop a flat photo reading as stock */}
        <div className="grain-layer absolute inset-0 opacity-[0.16] mix-blend-overlay" />
      </div>

      {/* ---------- Copy half ---------- */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:bg-zinc-950 lg:px-14">
        {/* Oversized slide index, treated as artwork rather than a label */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-10 select-none text-[7rem] font-bold leading-none tracking-tighter text-white/[0.06] lg:right-10 lg:text-[11rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="hidden"
            animate="show"
            exit="out"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
              out: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            }}
            className="relative max-w-lg"
          >
            {[
              <span
                key="e"
                className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-400"
              >
                <span className="h-px w-8 bg-accent-500" />
                {slide.eyebrow}
              </span>,
              <h1
                key="t"
                className="mt-6 text-[2.75rem] font-semibold leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-[4.25rem]"
              >
                {slide.title}
              </h1>,
              <p key="s" className="mt-5 max-w-sm text-[15px] leading-relaxed text-zinc-400">
                {slide.subtitle}
              </p>,
              <button
                key="c"
                onClick={() => navigate(slide.path)}
                className="group/cta mt-9 inline-flex items-center gap-3 rounded-full bg-white py-3.5 pl-7 pr-5 text-sm font-semibold text-zinc-950 transition-transform duration-200 active:scale-[0.98]"
              >
                {slide.cta}
                <span className="grid h-6 w-6 place-items-center rounded-full bg-zinc-950 text-white transition-transform duration-300 group-hover/cta:translate-x-1">
                  <Arrow />
                </span>
              </button>,
            ].map((child, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 28 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
                  out: { opacity: 0, y: reduce ? 0 : -14, transition: { duration: 0.3 } },
                }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Counter + progress. The fill animation IS the autoplay clock, so hovering
            the hero pauses the bar and the advance at exactly the same instant. */}
        <div className="absolute bottom-8 left-6 right-6 flex items-center gap-5 sm:left-10 sm:right-10 lg:left-14 lg:right-14">
          <span className="text-xs font-medium tabular-nums text-zinc-500">
            <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
            {" / "}
            {String(slides.length).padStart(2, "0")}
          </span>

          <div className="flex flex-1 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.image}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setManual(true);
                  setIndex(i);
                }}
                className="h-[2px] flex-1 overflow-hidden bg-white/20"
              >
                {i === index && !manual ? (
                  // Only the active bar animates, and its animationend is the autoplay
                  // clock. The functional update ignores a late event fired by a bar
                  // we have already moved past, which otherwise skipped a slide.
                  <span
                    key={`run-${index}`}
                    onAnimationEnd={() =>
                      setIndex((cur) => (cur === i ? (cur + 1) % slides.length : cur))
                    }
                    className="hero-progress block h-full bg-white group-hover/hero:[animation-play-state:paused]"
                  />
                ) : (
                  <span
                    key={`idle-${i}`}
                    className={`block h-full bg-white ${i <= index ? "w-full" : "w-0"}`}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            aria-label="Next slide"
            onClick={() => {
              setManual(true);
              go(1);
            }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-zinc-950"
          >
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainCarousel;
