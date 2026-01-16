
import { toast } from "react-toastify";
import { api } from "../../config/apiConfig";
import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, REMOVE_ITEM_FROM_CART_FAILURE, REMOVE_ITEM_FROM_CART_REQUEST, REMOVE_ITEM_FROM_CART_SUCCESS, UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType";


export const getCart=()=>async(dispatch)=>{
    dispatch({type:GET_CART_REQUEST});
    try{
        console.log("Fetching cart data...");
        console.log(localStorage.getItem("jwt"));
     const {data}=await api.get(`/api/cart/`) 
      console.log("Get cart response:", data);
     dispatch({type:GET_CART_SUCCESS,payload:data})
    }
    catch(error){

          console.error("❌ Get cart error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
       dispatch({
              type:GET_CART_FAILURE,
              payload:error.message
       })
    }
  
}


export const addItemToCart=(reqData) =>async(dispatch)=>{
            console.log(localStorage.getItem("jwt"));
    dispatch({type:ADD_ITEM_TO_CART_REQUEST});
    try{
    console.log("Adding item to cart with data:", reqData);
    
  
    const {data}= await api.put("/api/cart/add",reqData)
    console.log("Add  item to cart response:", data);
     dispatch({type:ADD_ITEM_TO_CART_SUCCESS,payload:data})

        dispatch(getCart());
    

    }
    catch(error){
            console.error("❌ Add to cart error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
       dispatch({

             

              type:ADD_ITEM_TO_CART_FAILURE,
              payload:error.message
       })

          toast.error(error.response?.data?.message || "Failed to add item to cart");
    }
}


export const removeItemFromCart=(reqData) =>async(dispatch)=>{
    dispatch({type:REMOVE_ITEM_FROM_CART_REQUEST});
    try{
    const {data}= await api.delete(`/api/cart_item/${reqData}`)
     dispatch({type:REMOVE_ITEM_FROM_CART_SUCCESS,payload:data})
       

       dispatch(getCart());
    }
    catch(error){
       dispatch({
              type:REMOVE_ITEM_FROM_CART_FAILURE,
              payload:error.message
       })
    }
}

export const updateItemToCart=(reqData) =>async(dispatch)=>{
    dispatch({type:UPDATE_CART_ITEM_REQUEST});
   
    try{
    const {data}= await api.put(`/api/cart_item/${reqData.cartItemId}`,reqData.data)
     dispatch({type:UPDATE_CART_ITEM_SUCCESS,payload:data})

       dispatch(getCart());

    }
    catch(error){                           
       dispatch({
              type:UPDATE_CART_ITEM_FAILURE,
              payload:error.message
       })
    }
}
