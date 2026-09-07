import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const HomeSectionCard = ({ product, index }) => {
  const navigate = useNavigate();
  const param = useParams();
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // Scroll-linked parallax: the photo drifts against the card as it crosses the
  // viewport, so a grid of stills reads as depth instead of wallpaper.
  // Motion value -> no scroll listener, no re-render per frame.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  const hasDiscount = product.discountPrice && product.price;
  const off = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group/card relative w-full cursor-pointer select-none"
    >
      {/* Image well — 4:5 editorial crop, the single most "premium retail" move */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-900">
        <motion.img
          style={{ y: imageY, willChange: 'transform' }}
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="absolute left-0 top-[-6%] h-[112%] w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.06]"
        />

        {/* Scrim only on hover, so the CTA is legible over any photo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/5 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-900 shadow-sm backdrop-blur-sm">
            {off}% off
          </span>
        )}

        {!param.productId && (
          <span className="absolute right-3 top-3 translate-y-[-6px] rounded-full bg-accent-600 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            New
          </span>
        )}

        {/* Quick action slides up from the image floor */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <button className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-zinc-900 shadow-lg transition-transform duration-150 active:scale-[0.98]">
            View details
          </button>
        </div>
      </div>

      {/* Copy sits on the page, not in a box — cards earn their border only when
          elevation means something, and here the photo already is the card. */}
      <div className="px-1 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[13px] font-semibold uppercase tracking-[0.08em] text-zinc-100">
            {product.brand}
          </h3>
          <span className="shrink-0 text-sm font-semibold tracking-tight text-white">
            ₹{product.discountPrice ?? product.price}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-3">
          <p className="truncate text-[13px] leading-relaxed text-zinc-400">
            {product.title}
          </p>
          {hasDiscount && (
            <span className="shrink-0 text-xs text-zinc-600 line-through">₹{product.price}</span>
          )}
        </div>

        {/* Hairline that draws in on hover — the only decoration on the card */}
        <span className="mt-3 block h-px w-0 bg-accent-600 transition-[width] duration-500 ease-out group-hover/card:w-full" />
      </div>
    </motion.article>
  );
};

export default HomeSectionCard;
