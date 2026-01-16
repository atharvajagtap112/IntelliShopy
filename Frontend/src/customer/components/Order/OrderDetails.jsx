import  { useEffect, useState } from 'react'
import AddressCard from '../AddressCard/adddressCard'
import OrderTracker from './OrderTracker'
import { Box, Grid } from '@mui/material'
import { deepPurple } from '@mui/material/colors'


import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useDispatch, useSelector } from 'react-redux'
import { getOrderById } from '../../../State/Order/Action'

import { useNavigate, useParams } from 'react-router-dom'

const OrderDetails = () => {
  const steps={
   
    "PLACED":0,
    "ORDER_CONFIRMED":1,
    "SHIPPED":2,
    "OUT_FOR_DELIVERY":3,
    "DELIVERED":4

  }



  const dispatch = useDispatch();
   
  const {order} = useSelector(store => store);

  const param=useParams();

  useEffect(() => {
    console.log("order Id", param.orderId);
      
    dispatch(getOrderById(param.orderId))
  },[param.orderId, dispatch] 
)

  const [activeStep,setActiveStep] = useState(0);

  const navigation =useNavigate();

  useEffect(() => {
    if(order?.order?.orderStatus){
      setActiveStep(steps[order?.order?.orderStatus.toUpperCase()]||0)
    }
  },[order?.order?.orderStatus, steps]
)


  return (
    <div className='px:5 lg:px-20'> 
    <div>
      <h1 className='font-bold text-xl text-left py-7'>Delivery Address</h1>
           <AddressCard address={order?.order?.shippingAddress}/>
    </div>
    <div className='py-20'> 
       <OrderTracker activeStep={activeStep}/>
    </div>

    <div className='space-y-5'    >
      {
        order?.order?.orderItems?.map((item)=>
        <Grid item container  className='shadow-xl rounded-md p-5 border'  sx={{alignItems:"center", justifyContent:"space-between"}} >
          <Grid item xs={6}>
             <div className='flex item-center space-x-4'>
              <img className='w-[5rem] h-[5rem] object-cover object-top'
              src={item.product.imageUrl}
              alt="" />
             

             <div className='text-left space-y-2 ml-5'>
              <p className='font-semibold'>{item?.product?.title}</p>
              <p className='space-x-5 opacity-50 text-xs'> <span>Size : {item.size}</span></p>
              <p> Seller: {item?.product?.brand}</p>
              <p>₹{item?.discountedPrice}</p>
             </div>
             </div>
            </Grid>  
              
             {order?.order?.orderStatus==="DELIVERED"&& <Grid item xs={6} >
                <Box sx={{color:deepPurple[500]}}
                 onClick={()=>navigation(`/add/review/${item.product.id}`)}
                
               >

                  <StarBorderIcon sx={{fontSize:"2rem"}} className='px-2 ' />
                      <span>Rate & Review Product</span>
                  
                </Box>
              </Grid>}

      </Grid>
      
        )
      }

      
    </div>
    </div>
  )
}

export default OrderDetails