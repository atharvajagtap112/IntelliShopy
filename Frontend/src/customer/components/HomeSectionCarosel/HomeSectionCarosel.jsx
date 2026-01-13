import React, { useState, useId } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useParams } from "react-router-dom";

const HomeSectionCarousel = ({ data, sectionName }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const uniqueId = useId().replace(/:/g, '');
  
  return (
    <div className="relative  overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-pink-50/20 to-blue-50/20" />

      {/* Full width container with minimal padding */}
      <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration:  0.6 }}
          className="mb-6 md:mb-8 px-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 mb-2">
            {sectionName}
          </h2>
          <div className="h-1 w-20 md:w-32 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 rounded-full" />
        </motion.div>

        {/* Carousel Container - Full Width */}
        <div className="relative group">
          <Swiper
            onSwiper={setSwiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.5}
            navigation={{
              prevEl: `.custom-prev-${uniqueId}`,
              nextEl: `.custom-next-${uniqueId}`,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              480: { 
                slidesPerView: 2.2, 
                spaceBetween:  12 
              },
              640: { 
                slidesPerView: 2.8, 
                spaceBetween: 16 
              },
              768: { 
                slidesPerView: 3.5, 
                spaceBetween: 16 
              },
              1024: { 
                slidesPerView: 4.2, 
                spaceBetween: 20 
              },
              1280: { 
                slidesPerView: 5, 
                spaceBetween:  20 
              },
              1536: { 
                slidesPerView: 6, 
                spaceBetween: 24 
              },
            }}
            className="! pb-10 md:!pb-12 pt-12"
          >
            {data?.slice(0, 10).map((item, index) => {
           
              return (
              <SwiperSlide key={item.id || index}>
                <HomeSectionCard product={item} index={index} />
              </SwiperSlide>
            )}) 
          }
          </Swiper>

          {/* Desktop Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`custom-prev-${uniqueId} hidden md:flex absolute -left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-md rounded-full shadow-xl items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-gray-100`}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`custom-next-${uniqueId} hidden md:flex absolute -right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/95 backdrop-blur-md rounded-full shadow-xl items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-gray-100`}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Mobile Navigation Buttons */}
          <div className="flex md:hidden justify-center gap-4 mt-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`custom-prev-${uniqueId} w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100`}
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`custom-next-${uniqueId} w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100`}
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination-bullet {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 8px;
          height: 8px;
          opacity: 0.5;
        }
        . swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default HomeSectionCarousel;