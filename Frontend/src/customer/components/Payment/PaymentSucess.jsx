import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { store } from '../../../State/store';
import { getOrderById } from '../../../State/Order/Action';
import { updatePayment } from '../../../State/Payment/Action';
import { Alert, AlertTitle, Grid } from '@mui/material';
import OrderTracker from '../Order/OrderTracker';
import AddressCard from '../AddressCard/adddressCard';
import Loading from '../Loading/loading';

const PaymentSucess = () => {
    const [paymentId, setPaymentId] = React.useState();
    const [referenceId, setReferenceId] = React.useState();
    const [paymentStatus, setPaymentStatus] = React.useState();
    const {orderId}= useParams();   
    
    const dispatch = useDispatch();
    const {order} = useSelector(store => store);
    
   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);

      setPaymentId(searchParams.get('razorpay_payment_id'))
      setPaymentStatus(searchParams.get('razorpay_payment_link_status'))

   }, []);

   useEffect(() => {
    dispatch(getOrderById(orderId))
       console.log("orderId: ", orderId, "paymentId: ", paymentId);
    if(paymentId){
          console.log("paymentId: ", paymentId);
          dispatch(updatePayment({
            orderId: orderId,
            paymentId: paymentId,
          }))
       }

   },[orderId, paymentId]);

    return (
    <div className='px-2 lg:px-36'>
      <div className='flex flex-col justify-center items-center'>
        <Alert 
         variant='filled'
         severity='success'
         sx={{mb:6, width:'git-content'}}>

          <AlertTitle>Payment Success</AlertTitle>
          Congratulation Your Order Get Placed
         </Alert>
         </div>
   <OrderTracker activeStep={1}/>
   
   {order.loading?
    <div className="lg:col-span-4 w-full flex justify-center items-center h-screen">
        <Loading/> </div>  :
   <Grid container  direction="column" className="space-y-2  py-5 pt-20" spacing={2} sx={{mt:4}}>
      
     {   order.order?.orderItems?.map((item)=>
       <Grid  container item className=" shadow-xl rounded-md p-5" sx={{alignItems:'center', justifyContent:'space-between'}}>
           <Grid  item xs={6}>
            <div className='flex justify-center items-center'>
              <img  className='w-[7rem] h-[7rem] object-cover object-top'
              src={item.product?.imageUrl} alt="" />
                

               <div className='ml-5 space-y-2 text-left'>
                <p>{item?.product?.title}</p>
                <div className='opacity-50 text-xs font-semibold space-x-5'>
                   
                   <span>Size: {item?.size} </span>
                </div>
                <p>Seller : {item?.product?.brand}</p>
                <p>₹ {item?.discountedPrice}</p>
               </div>

            </div>
            
            </Grid >

            <Grid item >
              <AddressCard address={order.order?.shippingAddress
}/>
              </Grid> 

        </Grid>
          
      ) 
        
        }
    </Grid>}
   
    </div>
  )
}

export default PaymentSucess