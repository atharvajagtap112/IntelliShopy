import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const ProductReviewsCard = ({ item, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongReview = item?.review?.length > 200;

  // Star Rating Component
  const StarRating = ({ value }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.svg
            key={star}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + star * 0.05, type: 'spring' }}
            className={`w-4 h-4 md:w-5 md:h-5 ${
              star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-. 921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-. 57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-3 md:gap-4">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Avatar
            sx={{
              width: { xs: 48, md: 56 },
              height: { xs: 48, md: 56 },
              bgcolor: '#1f2937',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 'bold',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {item?.user.firstName.charAt(0)}
            {item?.user.lastName.charAt(0)}
          </Avatar>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User Info & Rating */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h4 className="text-base md:text-lg font-bold text-gray-900 truncate">
                {item?.user.firstName} {item?.user.lastName}
              </h4>
              <p className="text-xs md:text-sm text-gray-500">
                {dayjs(item?.createdAt).format('MMMM D, YYYY')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={item?.rating} />
              <span className="text-sm font-semibold text-gray-700">
                {item?.rating}.0
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="relative">
            <p
              className={`text-sm md:text-base text-gray-700 leading-relaxed ${
                !isExpanded && isLongReview ? 'line-clamp-3' : ''
              }`}
            >
              {item?.review}
            </p>

            {/* Read More Button */}
            {isLongReview && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default ProductReviewsCard;