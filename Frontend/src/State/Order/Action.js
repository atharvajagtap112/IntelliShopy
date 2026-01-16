
import { api } from "../../config/apiConfig"
import { ADD_REVIEW_FAILURE, ADD_REVIEW_REQUEST, ADD_REVIEW_SUCCESS, CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_ORDER_BY_ID_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS, GET_ORDERS_FAILURE, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS } from "./ActionType"

import { toast } from 'react-toastify';
export const createOrder=(reqData)=> async (dispatch) => {

     

    dispatch({type:CREATE_ORDER_REQUEST})
    try{
        console.log("reqData", reqData);
      const {data} =await api.post("/api/orders/", reqData.orderData) 
  console.log("Order created successfully", data);
     
      
      if(data.id){
        reqData.navigate({search:`step=3&order_id=${data.id}`})
      }

    

      dispatch({
        type:CREATE_ORDER_SUCCESS,
        payload:data
      }) 

    }
    catch(error){
        dispatch({
            type:CREATE_ORDER_FAILURE,
            payload:error.message
        })
    }
}


export const getOrderById = (orderId) => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });

    try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        console.log("order by id", data);

        dispatch({
            type: GET_ORDER_BY_ID_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.log("catch", error);
        dispatch({
            type: GET_ORDER_BY_ID_FAILURE,
            payload: error,
        });
    }
};

export const getOrders = (reqData) => async (dispatch) => {
    dispatch({type: GET_ORDERS_REQUEST})
    
    try{
        const {data}=await api.post("/api/orders/user",reqData.status)
        console.log("Orders fetched successfully", data);
        dispatch({type:GET_ORDERS_SUCCESS,payload:data})
    }
    catch(error){
        console.log("Error fetching orders", error);
        dispatch({type:GET_ORDERS_FAILURE,payload:error.message})
    }
}



export const addReview = (review) => async (dispatch) => {
    dispatch({ type: ADD_REVIEW_REQUEST });

    try {
        console.log("Adding Review", review);
        const { data } = await api.post("/api/review/create", review);
        console.log("Review Added", data);

        toast.success("Review Added Successfully");
        dispatch({ type: ADD_REVIEW_SUCCESS });
    } catch (error) {
        console.log("Error Adding Review", error);

        toast.error("Error Adding Review");
        dispatch({ type: ADD_REVIEW_FAILURE, payload: error.message });
    }
};