import { Rating } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductReviewsCard from './ProductReviewsCard';

// 📊 Progress Bar Component
const ProgressBar = ({ value, color = 'bg-accent-500' }) => {
  return (
    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${color} relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-30"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

const ProductReviewsSection = ({ item }) => {
  const reviews = item || [];
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating =
    totalReviews === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

  // Group reviews by star rating
  const starCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const starIndex = Math.floor(5 - r.rating);
    if (starIndex >= 0 && starIndex < 5) {
      starCount[starIndex]++;
    }
  });

  // Rating breakdown data
  const ratingData = [
    { label: 'Excellent', stars: 5, value: starCount[0], color: 'bg-accent-500' },
    { label: 'Very Good', stars:  4, value: starCount[1], color: 'bg-accent-400' },
    { label: 'Good', stars: 3, value: starCount[2], color: 'bg-zinc-400' },
    { label: 'Average', stars: 2, value: starCount[3], color: 'bg-zinc-500' },
    { label: 'Poor', stars: 1, value: starCount[4], color: 'bg-zinc-600' },
  ].map((entry) => ({
    ...entry,
    percent: totalReviews === 0 ? 0 : ((entry.value / totalReviews) * 100).toFixed(0),
  }));

  // Filter reviews
  const filteredReviews =
    filter === 'all' ? reviews : reviews.filter((r) => r.rating === parseInt(filter));

  return (
    <section className="w-full bg-zinc-950 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left:  Overall Rating & Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity:  1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            {/* Overall Rating Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 mb-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale:  1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="text-6xl md:text-7xl font-black text-white mb-2">
                    {averageRating}
                  </div>
                </motion.div>
                <Rating
                  value={Number(averageRating)}
                  readOnly
                  precision={0.1}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#1f2937' },
                    '& .MuiRating-iconEmpty': { color: '#d1d5db' },
                  }}
                />
                <p className="text-zinc-400 font-medium mt-2 text-sm md:text-base">
                  Based on {totalReviews} review{totalReviews !== 1 && 's'}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {ratingData.map((rating, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() =>
                      setFilter(filter === rating.stars.toString() ? 'all' : rating.stars.toString())
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      filter === rating.stars.toString()
                        ? 'bg-white text-zinc-950 shadow-lg scale-105'
                        : 'bg-zinc-900 hover:bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="w-16 md:w-20 text-left">
                      <p className="text-xs md:text-sm font-bold">{rating.label}</p>
                    </div>
                    <div className="flex-1">
                      <ProgressBar
                        value={rating.percent}
                        color={filter === rating.stars.toString() ? 'bg-white' : rating.color}
                      />
                    </div>
                    <div className="w-14 md:w-16 text-right">
                      <p className="text-xs md:text-sm font-bold">{rating.value}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(rating.stars)].map((_, i) => (
                        <span key={i} className="text-xs md:text-sm">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Filter Reset */}
          
            </div>
          </motion.div>

          {/* Right: Customer Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg: col-span-7"
          >
            <div className="h-[30rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-4 pr-2">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((rev, index) => (
                    <ProductReviewsCard key={rev.id} item={rev} index={index} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/15"
                  >
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-lg text-zinc-400 font-medium">
                      No reviews yet for this rating
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviewsSection;