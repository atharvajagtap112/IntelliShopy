import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeSectionCard = ({ product, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const param = useParams();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity:  1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      className="relative cursor-pointer group h-[24rem] sm:h-[26rem] md:h-[28rem] w-full"
    >
      {/* Card Container - Using flex column with fixed structure */}
      <div className="relative  h-full w-[18rem] bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-white/50 flex flex-col">
        
        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.08 : 0 }}
          className="absolute inset-0 bg-gray-900 z-10 pointer-events-none"
        />

        {/* Image Container - Fixed Height */}
        <div className="relative h-[19rem] w-full overflow-hidden flex-shrink-0">
          {/* Badge */}
          { !param.productId&& <motion.div
            initial={{ x: -100, opacity: 0 }}S
            animate={{ x: isHovered ? 0 : -100, opacity: isHovered ?  1 : 0 }}
            className="hidden sm:block absolute top-3 left-0 z-20 bg-gray-900 text-white px-3 py-1 rounded-r-full text-xs font-bold shadow-lg"
          >
            NEW
          </motion.div> }

          {/* Image with Zoom Effect */}
          <motion.img
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full object-cover object-top"
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
          />

          {/* Gradient Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content Section - Flex grow to fill remaining space */}
        <div className="relative p-3 md:p-4 flex flex-col flex-grow">
          {/* Brand Name - Fixed Height */}
          <h3 className="text-base md:text-lg font-bold tracking-tight line-clamp-1 text-gray-900 h-6 md:h-7">
            {product.brand}
          </h3>

          {/* Product Title - Fixed Height with 2 lines */}
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed mt-1 h-[2.5rem] md:h-[2.75rem]">
            {product.title}
          </p>

          {/* Price Section - Always at same position */}
          <div className=" pt-1">
            {product.discountPrice ?  (
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold bg-clip-text text-black ">
                  ₹{product.discountPrice}
                </span>
                {product.price && (
                  <span className="text-xs md:text-sm text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
            ) : product.price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold bg-clip-text text-black ">
                  ${product.price}
                </span>
              </div>
            ) : (
              <div className="h-[2rem]"></div> // Placeholder if no price
            )}
          </div>

         { /* Action Button - Desktop only, on hover */}
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ?  1 : 0, 
                  y: isHovered ?  0 : 10 
                }}
                className="hidden md:block absolute bottom-3 left-3 right-3"
                >
                <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300">
                  View Details
                </button>
                </motion.div>
              </div>

        {/* Decorative Corner Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-900/15 to-transparent rounded-bl-full" />
        <div className="hidden md:block absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-900/15 to-transparent rounded-tr-full" />
      </div>

      {/* Glow Effect on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        className="hidden md:block absolute -inset-0.5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 rounded-3xl blur-lg -z-10"
      />
    </motion.div>
  );
};

export default HomeSectionCard;