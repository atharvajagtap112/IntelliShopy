import React, { useEffect } from "react";
import CardItem from "./CardItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../State/Cart/Action";
import { toast } from "react-toastify";
import Loading from "../Loading/loading";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const CartCard = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector(store => store);

  const handleCheckout = () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      toast.error("Your cart is empty.  Please add items to your cart before proceeding to checkout.");
      return;
    }
    navigation("/checkout?step=2");
  }

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch]);

  if (cart.loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-950">
        <Loading variant="rows" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-5 md:py-10 ">
      <div className="max-w-7xl mx-auto px-4 ">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <ShoppingBagOutlinedIcon className="text-4xl" />
            Shopping Cart
          </h1>
          <p className="text-zinc-400 mt-2">
            {cart.cartItems?.length || 0} {cart.cartItems?.length === 1 ? 'item' :  'items'} in your cart
          </p>
        </motion.div>

        {cart.cartItems?.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity:  1, scale: 1 }}
            className="flex flex-col justify-center items-center h-[60vh]"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShoppingBagOutlinedIcon style={{ fontSize: 120 }} className="text-zinc-700 mb-6" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-200 mb-3">Your Cart is Empty</h2>
            <p className="text-zinc-400 mb-8">Looks like you haven't added anything yet</p>
            <Button
              onClick={() => navigation('/')}
              variant="contained"
              sx={{
                bgcolor: 'black',
                color: 'white',
                px: 4,
                py:  1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1a1a1a',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          // Cart with Items
          <div className="lg:grid lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart?.cartItems?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CardItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Price Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 mt-8 lg:mt-0"
            >
              <div className="sticky top-8">
                <div className="bg-zinc-950 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-white/[0.07] border-b border-white/10 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Order Summary</h3>
                  </div>

                  <div className="p-6 space-y-4">
                    
                    {/* Price Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-zinc-300">
                        <span className="flex items-center gap-2">
                          <ShoppingBagOutlinedIcon fontSize="small" />
                          Subtotal
                        </span>
                        <span className="font-semibold">₹{cart.cart?.totalPrice}</span>
                      </div>

                      <div className="flex justify-between items-center text-accent-400">
                        <span className="flex items-center gap-2">
                          <LocalOfferOutlinedIcon fontSize="small" />
                          Discount
                        </span>
                        <span className="font-semibold">-₹{cart.cart?.discount}</span>
                      </div>

                      <div className="flex justify-between items-center text-accent-400">
                        <span className="flex items-center gap-2">
                          <LocalShippingOutlinedIcon fontSize="small" />
                          Delivery
                        </span>
                        <span className="font-semibold">FREE</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total Amount</span>
                        <span className="text-2xl font-bold text-white">₹{cart.cart?.totalDiscountPrice}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 text-right">Inclusive of all taxes</p>
                    </div>

                    {/* Savings Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale:  1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-3 text-center"
                    >
                      <p className="text-accent-300 font-semibold">
                        You're saving ₹{cart.cart?.discount}!  🎉
                      </p>
                    </motion.div>

                    {/* Checkout Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleCheckout}
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: '#ffffff',
                          color: '#09090b',
                          py: 1.5,
                          borderRadius: 999,
                          textTransform: 'none',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#e4e4e7', boxShadow: 'none' },
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <div className="pt-4 space-y-2 text-xs text-zinc-400">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-500/100 rounded-full"></span>
                        100% Secure Payments
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-500/100 rounded-full"></span>
                        Easy Returns & Refunds
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartCard;