import React from 'react';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AddressCard = ({ address, isSelected, onSelect, showSelectButton = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
        isSelected ?  'border-gray-900 shadow-xl' : 'border-gray-200'
      }`}>
        
        {/* Selected Badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 right-3 z-10"
          >
            <div className="bg-gray-900 text-white rounded-full p-1 shadow-lg">
              <CheckCircleIcon sx={{ fontSize: 20 }} />
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 text-white">
            <LocationOnOutlinedIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            <h3 className="font-bold text-base md:text-lg">Delivery Address</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
          
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="flex-shrink-0 mt-0.5 bg-gray-100 rounded-full p-1. 5 md:p-2">
              <PersonOutlineIcon className="text-gray-700" sx={{ fontSize: { xs: 18, md: 20 } }} />
            </div>
           
            
              <p className="text-base md:text-lg font-bold text-gray-900 break-words">
                {address?. firstName} {address?.lastName}
              </p>
            
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, x:  -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-2 md:gap-3"
          >
            <div className="flex-shrink-0 mt-0.5 bg-gray-100 rounded-full p-1.5 md:p-2">
              <LocationOnOutlinedIcon className="text-gray-700" sx={{ fontSize: { xs: 18, md: 20 } }} />
            </div>
           
             
              <div className="text-sm md:text-base text-gray-800 leading-relaxed space-y-1">
                {address?.streetAddress && (
                  <p className="break-words overflow-wrap-anywhere">
                    {address. streetAddress}, {address?.city}{address?.city && address?.state && ', '}{address?.state}, {address. zipCode}
                  </p>
                )}
               
                
              </div>
            
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x:  -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="flex-shrink-0 mt-0.5 bg-gray-100 rounded-full p-1.5 md:p-2">
              <PhoneOutlinedIcon className="text-gray-700" sx={{ fontSize: { xs: 18, md: 20 } }} />
            </div>
           
              <p className="text-sm md:text-base font-semibold text-gray-900 break-all">
                +91 {address?.mobile}
              </p>
            
          </motion.div>

          {/* Select Button (Optional) */}
          {showSelectButton && onSelect && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelect}
              className={`w-full py-2. 5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-lg'
                  :  'bg-gray-100 text-gray-900 hover: bg-gray-200'
              }`}
            >
              {isSelected ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircleIcon fontSize="small" />
                  Selected Address
                </span>
              ) : (
                'Deliver to this Address'
              )}
            </motion.button>
          )}
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
          initial={{ scaleX:  0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default AddressCard;