import { api } from "../../config/apiConfig"
import { UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST } from "../Cart/ActionType"
import { CREATE_ORDER_FAILURE, CREATE_ORDER_SUCCESS } from "../Order/ActionType"
import { CREATE_PAYMENT_REQUEST, UPDATE_PAYMENT_FAILURE, UPDATE_PAYMENT_REQUEST } from "./ActionType"

export  const createPayment=(orderId)=> async(dispatch)=>{
   dispatch({type:CREATE_PAYMENT_REQUEST})
   try{
       
         console.log("orderId", orderId);

    const {data}=  await api.post(`/api/payments/${orderId}`,{})
       if(data.payment_link_url){
        window.location.href = data.payment_link_url;
       }

    dispatch({ type:CREATE_ORDER_SUCCESS,payload:data })
   }
   catch(error){

     dispatch({type:CREATE_ORDER_FAILURE,payload:error.message})
   }
}


export const updatePayment=(reqData)=> async(dispatch)=>{
   dispatch({type:UPDATE_PAYMENT_REQUEST})
   try{
      console.log("update payment reqData: ", reqData);
    const {data}=  await api.get(`/api/payments?payment_id=${reqData.paymentId}&order_id=${reqData.orderId}`);
   
      console.log("update payment:  "+data.message)
   }
   catch(error){
      console.log("update payment error:  "+error.message)
     dispatch({type:UPDATE_PAYMENT_FAILURE,payload:error.message})
   }
}