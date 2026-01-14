import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = Math.round(
    ((product.price - product. discountPrice) / product.price) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y:  20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full sm:w-[15rem] m-2 sm:m-3 cursor-pointer"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-gray-900 transition-all duration-500">
        
        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 z-10 pointer-events-none"
        />

        {/* Image Container */}
        <div className="relative h-[20rem] w-full overflow-hidden bg-gray-50">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale:  1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="absolute top-3 left-3 z-20 bg-black text-white px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1"
            >
              <LocalOfferIcon sx={{ fontSize: 14 }} />
              <span className="text-xs font-bold">{discountPercentage}% OFF</span>
            </motion.div>
          )}

          {/* Image with Zoom Effect */}
          <motion.img
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full h-full object-cover object-top"
            src={product.imageUrl}
            alt={product. title}
            loading="lazy"
          />

          {/* Gradient Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content Section */}
        <motion.div
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-white"
        >
          {/* Brand */}
          <p className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wide truncate">
            {product.brand}
          </p>

          {/* Title */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10 leading-5">
            {product.title}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.discountPrice}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price}
            </span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              {discountPercentage}% off
            </span>
          </div>
        </motion.div>

        {/* Bottom Border Animation */}
        <motion.div
          className="h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;