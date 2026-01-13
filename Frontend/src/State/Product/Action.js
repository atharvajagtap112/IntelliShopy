import axios from "axios";
import { api, API_BASE_URL } from "../../config/apiConfig";
import { FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCT_REQUEST, FIND_PRODUCT_SUCCESS, FIND_PRODUCTS_BY_CATEGORY_FAILURE, FIND_PRODUCTS_BY_CATEGORY_SUCCESS, FIND_PRODUCTS_BY_CATEGORYS_REQUEST, REMOVE_PRODUCT } from "./ActionType";

export const findProducts=(reqData)=>async(dispatch)=>{
    
    dispatch({type:FIND_PRODUCT_REQUEST})
    
       const{
        colors,
        sizes,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        category,
        stock,
        sort,
        pageNumber,
        pageSize
       }=reqData;   

   try{
       const {data}= await axios.get(`${API_BASE_URL}/products?color=${colors}&size=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&maxDiscount=${maxDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
           
         console.log("Products fetched successfully:", data);   
       dispatch({type:FIND_PRODUCT_SUCCESS,payload:data})     
    }
    catch(error){
        console.error("Error fetching products:", error);
       dispatch({
           type:FIND_PRODUCT_BY_ID_FAILURE,
           payload:error.message
       })
    }
}

export const removeProduct=()=>(dispatch)=>{
    dispatch({type:REMOVE_PRODUCT})
}

export const findProductsById=(reqData)=>async(dispatch)=>{
    
    dispatch({type:FIND_PRODUCT_BY_ID_REQUEST})
       const{ productId}=reqData;   
    try{
        const {data}=await axios.get(`${API_BASE_URL}/products/${productId}`)

        console.log("Product fetched successfully:", data);

       dispatch({type:FIND_PRODUCT_BY_ID_SUCCESS,payload:data})     
    }
    catch(error){
      dispatch({type:FIND_PRODUCT_BY_ID_FAILURE,payload:error.message})
    }
}



export const findProductsByCategories=(reqData)=>async(dispatch)=>{

                dispatch({type:FIND_PRODUCTS_BY_CATEGORYS_REQUEST})
   try{
         console.log("Fetching products by categories with data:", reqData);

       const {data}= await axios.post(`${API_BASE_URL}/products/bycategories`, reqData)

         console.log("Products By Category fetched successfully:", data);
       dispatch({type:FIND_PRODUCTS_BY_CATEGORY_SUCCESS,payload:data})
    }
    catch(error){
        console.error("Error fetching products:", error);
       dispatch({
              type:FIND_PRODUCTS_BY_CATEGORY_FAILURE,
           payload:error.message
       })
    }
}

