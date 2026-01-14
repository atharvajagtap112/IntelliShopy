import React, { use, useEffect } from 'react'
import AddressCard from '../AddressCard/adddressCard'
import CardItem from '../Card/CardItem'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../../State/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { findProductsById } from '../../../State/Product/Action'
import { getOrderById } from '../../../State/Order/Action'
import { createPayment } from '../../../State/Payment/Action'
import { toast } from 'react-toastify'
import Loading from '../Loading/loading'
import { motion } from "framer-motion"
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSummary = () => {

 const {order}=useSelector(store=>store)
 const {payment}=useSelector(store=>store)

const dispatch = useDispatch();
 const discount = order.order?.totalPrice - order.order?.totalDiscountedPrice;
const navigation = useNavigate();
const location= useLocation();
const searchParams=new URLSearchParams(location.search);
  const orderId=searchParams.get("order_id");

  useEffect(() => {
  dispatch(getOrderById(orderId))
},[orderId])

  

const handleCheckout=()=>{

if(!order.order?.orderItems || order.order?.orderItems.length===0){
  toast.error("Your order is empty. Please add items to your order before proceeding to checkout.");
  navigation("/login");
  return;
  
}

dispatch(createPayment(orderId))
}

  return (
    <>

   { 
    order.loading? 
  <div   className="lg:col-span-4 w-full flex justify-center items-center h-screen">
      
                  <Loading/>
                  </div>
    
    :
    
    <div className=' space-y-5'> 
    

      <div className='p-5 shadow-lg rounded-5-md border   '>
          <AddressCard address={order.order?.shippingAddress} />
           
      </div>
        <div>
      <div className="lg:grid grid-cols-3 gap-4 space-y-5 lg:px-1 relative">
        <div className="col-span-2 ">
         {order.order?.orderItems?.map((item)=> <div className='pb-5'> <CardItem  item={item} isCheckout={true}/></div>) }
        </div>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x:  0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <PaymentOutlinedIcon />
                    Price Details
                  </h3>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 space-y-4">
                  
                  {/* Subtotal */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <ShoppingBagOutlinedIcon fontSize="small" />
                      Price ({order.order?.totalItem || 0} items)
                    </span>
                    <span className="font-semibold text-lg">₹{order.order?.totalPrice || 0}</span>
                  </motion.div>

                  {/* Discount */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-between items-center text-green-600"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <LocalOfferOutlinedIcon fontSize="small" />
                      Discount
                    </span>
                    <span className="font-semibold text-lg">-₹{discount || 0}</span>
                  </motion.div>

                  {/* Delivery Charges */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-between items-center text-green-600"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <LocalShippingOutlinedIcon fontSize="small" />
                      Delivery Charges
                    </span>
                    <span className="font-semibold text-lg">FREE</span>
                  </motion.div>

                  {/* Divider */}
                  <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

                  {/* Total Amount */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-900"
                  >
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{order. order?.totalDiscountedPrice || 0}
                    </span>
                  </motion.div>

                  {/* Savings Badge */}
                  {discount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale:  1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg">
                        <CheckCircleOutlineIcon />
                        You're saving ₹{discount}!
                      </div>
                      <p className="text-green-600 text-sm mt-1">on this order</p>
                    </motion.div>
                  )}

                  {/* Checkout Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleCheckout}
                      fullWidth
                      variant="contained"
                      disabled={payment.loading}
                      sx={{
                        bgcolor: 'black',
                        color: 'white',
                        py: 2,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1.125rem',
                        fontWeight:  700,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        '&:hover':  {
                          bgcolor: '#1a1a1a',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                        },
                        '&. Mui-disabled': {
                          bgcolor: '#6b7280',
                          color: 'white',
                        },
                      }}
                    >
                      {payment.loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          </div>
                          <span className="text-white font-medium">Processing payment...</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <PaymentOutlinedIcon />
                          Proceed to Payment
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
    
    
    </div>
    } </>
  )
}

export default OrderSummary