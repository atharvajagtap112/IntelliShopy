import { Rating } from '@mui/material';
import React from 'react';

// ⭐ Star Rating Component
const StarRating = ({ value, maxStars = 5 }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;

  return (
    <div className="flex items-center text-yellow-400 text-lg">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalfStar && <span>⭐</span>}
      {[...Array(maxStars - Math.ceil(value))].map((_, i) => (
        <span key={i} className="text-gray-300">☆</span>
      ))}
    </div>
  );
};

// 📊 Progress Bar Component
const ProgressBar = ({ value, color = 'bg-blue-500' }) => {
  const colorClasses = {
    'bg-green-500': 'bg-green-500',
    'bg-blue-500': 'bg-blue-500',
    'bg-yellow-500': 'bg-yellow-500',
    'bg-red-500': 'bg-red-500'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color] || color}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

const ProductReviewsSection = ({ item }) => {
  const reviews = item ||[] ;

  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating =
    totalReviews === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

  // Group reviews by star rating (5, 4, 3, 2, 1)
  const starCount = [0, 0, 0, 0, 0]; // index 0 = 5 stars, index 4 = 1 star

  reviews.forEach((r) => {
    const starIndex = Math.floor(5 - r.rating); // rating 5 -> index 0, 4 -> 1, etc.
    if (starIndex >= 0 && starIndex < 5) {
      starCount[starIndex]++;
    }
  });

  // Create dynamic rating breakdown data
  const ratingData = [
    { label: 'Excellent', value: starCount[0], color: 'bg-green-500' },
    { label: 'Very Good', value: starCount[1], color: 'bg-green-500' },
    { label: 'Good', value: starCount[2], color: 'bg-blue-500' },
    { label: 'Average', value: starCount[3], color: 'bg-yellow-500' },
    { label: 'Poor', value: starCount[4], color: 'bg-red-500' }
  ].map(entry => ({
    ...entry,
    percent: totalReviews === 0 ? 0 : ((entry.value / totalReviews) * 100).toFixed(0)
  }));

  return (
     <section className="w-full max-w-6xl  p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Rating & Breakdown */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-semibold pb-3">Product Rating</h2>

          <div className="flex items-center space-x-3 mb-6">
            <Rating value={Number(averageRating)} readOnly precision={0.1} />
            <p className="text-gray-600 font-medium">
              {averageRating} ({totalReviews} Review{totalReviews !== 1 && 's'})
            </p>
          </div>

          <div className="space-y-4">
            {ratingData.map((rating, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-right">
                  <p className="text-sm font-semibold text-gray-700">{rating.label}</p>
                </div>
                <div className="flex-1">
                  <ProgressBar value={rating.percent} color={rating.color} />
                </div>
                <div className="w-12 text-left">
                  <p className="text-sm text-gray-600">{rating.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
       

         {/* Right: Customer Reviews */}
        {/* <div className="lg:col-span-7">
          <h2 className="text-xl font-semibold pb-3">Customer Reviews</h2>
          <div className="space-y-6">
            {totalReviews > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <StarRating value={rev.rating} />
                    <p className="text-sm text-gray-500 opacity-70">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-gray-800">{rev.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        </div> */}
      </div>
        
      
    </section>
  );
};

export default ProductReviewsSection;
