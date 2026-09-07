import React from "react";

// Skeletons exist to hold the shape of what is actually coming. A product grid
// standing in for a cart or an order summary is worse than no skeleton at all -
// the page visibly reshuffles the moment data lands. So there are three shapes.
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded-full bg-white/[0.07] ${className}`}>
    <div className="shimmer absolute inset-0" />
  </div>
);

const GridSkeleton = () => (
  <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8 border-b border-white/10 pb-4">
      <Shimmer className="h-3 w-28" />
      <Shimmer className="mt-3 h-9 w-64" />
    </div>
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Shimmer className="aspect-[4/5] w-full !rounded-2xl" />
          <div className="space-y-2 px-1 pt-4">
            <Shimmer className="h-3 w-1/2" />
            <Shimmer className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Cart: a stack of line items beside a summary panel.
const RowsSkeleton = () => (
  <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
    <Shimmer className="mb-8 h-9 w-56" />
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Shimmer className="h-28 w-24 shrink-0 !rounded-xl" />
            <div className="flex-1 space-y-3 py-1">
              <Shimmer className="h-4 w-2/3" />
              <Shimmer className="h-3 w-1/3" />
              <Shimmer className="h-5 w-24" />
              <Shimmer className="h-9 w-32 !rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <SummarySkeleton bare />
    </div>
  </div>
);

// Order summary: header bar, a few label/value rows, a rule, a total, a CTA.
const SummarySkeleton = ({ bare = false }) => {
  const panel = (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-white/[0.05] px-6 py-5">
        <Shimmer className="h-5 w-40" />
      </div>
      <div className="space-y-4 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-16" />
          </div>
        ))}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <Shimmer className="h-5 w-28" />
            <Shimmer className="h-6 w-24" />
          </div>
        </div>
        <Shimmer className="h-12 w-full !rounded-full" />
      </div>
    </div>
  );
  if (bare) return panel;
  return <div className="mx-auto w-full max-w-md px-4 py-10">{panel}</div>;
};

// Orders list: wide cards, each with a title row and three detail columns.
const OrdersSkeleton = () => (
  <div className="space-y-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-9 !rounded-xl" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-3 w-24" />
            </div>
          </div>
          <Shimmer className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, c) => (
            <div key={c} className="space-y-2.5">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-3/4" />
              <Shimmer className="h-3 w-2/3" />
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-4">
          <Shimmer className="h-3 w-36" />
        </div>
      </div>
    ))}
  </div>
);

const Loading = ({ variant = "grid" }) => (
  <>
    {variant === "rows" ? (
      <RowsSkeleton />
    ) : variant === "summary" ? (
      <SummarySkeleton />
    ) : variant === "orders" ? (
      <OrdersSkeleton />
    ) : (
      <GridSkeleton />
    )}
    <span className="sr-only" role="status">
      Loading&hellip;
    </span>
  </>
);

export default Loading;
