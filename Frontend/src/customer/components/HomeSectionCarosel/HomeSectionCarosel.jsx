import React, { useState, useId } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const HomeSectionCarousel = ({ data, sectionName }) => {
  const [setSwiperRef] = useState(null);
  const uniqueId = useId().replace(/:/g, '');
  
  return (
    <div className="relative overflow-hidden">

      {/* Full width container with minimal padding */}
      <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 md:mb-8 px-2 flex items-end justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-600">
              Shop the edit
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-none capitalize text-white">
              {sectionName?.replace(/_/g, " ")}
            </h2>
          </div>
          <span className="hidden sm:block shrink-0 text-sm text-zinc-500">
            {data?.length ?? 0} pieces
          </span>
        </motion.div>

        {/* Carousel Container - Full Width */}
        <div className="relative group/rail">
          <Swiper
            onSwiper={setSwiperRef}
            modules={[Navigation, Pagination]}
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
                spaceBetween: 22 
              },
            }}
            className="!pb-10 md:!pb-12 pt-12"
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
            className={`custom-prev-${uniqueId} hidden md:flex absolute -left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 border-white/20 text-white hover:bg-white hover:text-zinc-950 backdrop-blur-md rounded-full shadow-xl items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-all duration-300 border`}
          >
            <svg
              className="w-6 h-6 text-current"
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
            className={`custom-next-${uniqueId} hidden md:flex absolute -right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 border-white/20 text-white hover:bg-white hover:text-zinc-950 backdrop-blur-md rounded-full shadow-xl items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-all duration-300 border`}
          >
            <svg
              className="w-6 h-6 text-current"
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
              className={`custom-prev-${uniqueId} w-10 h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center`}
            >
              <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`custom-next-${uniqueId} w-10 h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center`}
            >
              <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeSectionCarousel;