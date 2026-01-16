
  import { useState } from "react";
  import AddIcon from '@mui/icons-material/Add';
  import RemoveIcon from '@mui/icons-material/Remove';
  import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
  import LocalOfferIcon from '@mui/icons-material/LocalOffer';
  import { useDispatch } from "react-redux";
  import { removeItemFromCart, updateItemToCart } from "../../../State/Cart/Action";
import { motion } from "framer-motion";

const CardItem = ({ item, isCheckout }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const dispatch = useDispatch();

  const findDiscount = (price, discountPrice) => {
    if (price && discountPrice) {
      const discount = ((price - discountPrice) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const updateCartItem = (num) => {
    const data = {
      data: { quantity: item.quantity + num },
      cartItemId: item?.id
    };
    dispatch(updateItemToCart(data));
  };

  const handleRemoveItem = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch(removeItemFromCart(item.id));
    }, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isRemoving ? 0 :  1, 
        x: isRemoving ? 100 : 0,
        scale: isRemoving ? 0.8 : 1
      }}
      exit={{ opacity: 0, x:  100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl lg:rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
    >
      <div className="p-3 lg:p-6">
        <div className="flex gap-3 lg:gap-6">
          
          {/* Product Image */}
          <div className="relative  w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg lg:rounded-xl overflow-hidden bg-gray-100 shadow-sm">
            <img
              className="w-full h-full object-cover object-top"
              src={item.product.imageUrl}
              alt={item.product.title}
            />
            
            {/* Discount Badge */}
            {findDiscount(item.product.price, item.product.discountPrice) > 0 && (
              <div className="absolute top-1 left-1 bg-black text-white text-[10px] lg:text-xs font-bold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-md shadow-lg flex items-center gap-0.5">
                <LocalOfferIcon sx={{ fontSize: { xs: 10, lg: 12 } }} />
                {findDiscount(item.product.price, item.product.discountPrice)}%
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-grow flex flex-col min-w-0">
            
            {/* Title and Remove Button */}
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-sm lg:text-lg line-clamp-2 flex-grow">
                {item.product.title}
              </h3>
              
              {! isCheckout && (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <IconButton
                    onClick={handleRemoveItem}
                    size="small"
                    sx={{
                      padding: { xs: '4px', lg: '8px' },
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      '&:hover': {
                        bgcolor: '#ef4444',
                        color: 'white',
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: { xs: 16, lg: 20 } }} />
                  </IconButton>
                </motion.div>
              )}
            </div>

            {/* Brand and Size */}
            <div className="flex flex-wrap gap-2 lg:gap-3 text-xs lg:text-sm text-gray-600 mb-2">
              <span className="font-medium">{item.product.brand}</span>
              <span className="text-gray-400">•</span>
              <span>Size: <span className="font-semibold text-gray-800">{item.size}</span></span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-lg lg:text-2xl font-bold text-gray-900">
                ₹{item.discountedPrice}
              </span>
              <span className="text-xs lg:text-sm text-gray-400 line-through">
                ₹{item.price}
              </span>
              <span className="text-[10px] lg:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">
                {findDiscount(item.product.price, item.product.discountPrice)}% OFF
              </span>
            </div>

            {/* Quantity Controls */}
            {!isCheckout && (
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-xs lg:text-sm text-gray-600 font-medium">Qty:</span>
                <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateCartItem(-1)}
                    disabled={item.quantity <= 1}
                    className={`p-1.5 lg:p-2 ${item.quantity <= 1 ? 'opacity-40' : 'hover:bg-gray-200'} transition-colors rounded-l-lg`}
                  >
                    <RemoveIcon sx={{ fontSize: { xs:  16, lg: 20 } }} />
                  </motion.button>
                  
                  <motion.span
                    key={item.quantity}
                    initial={{ scale:  1.3 }}
                    animate={{ scale: 1 }}
                    className="px-3 lg:px-4 py-1 font-bold text-gray-900 text-sm lg:text-base min-w-[32px] lg:min-w-[40px] text-center"
                  >
                    {item.quantity}
                  </motion.span>
                  
                  <motion. button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateCartItem(1)}
                    className="p-1.5 lg:p-2 hover:bg-gray-200 transition-colors rounded-r-lg"
                  >
                    <AddIcon sx={{ fontSize: { xs: 16, lg: 20 } }} />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border Animation */}
      <motion.div
        className="h-0.5 lg:h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"
        initial={{ scaleX:  0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once:  true }}
        transition={{ duration:  0.5, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default CardItem;