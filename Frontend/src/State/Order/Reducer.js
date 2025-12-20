import { ADD_REVIEW_FAILURE, ADD_REVIEW_REQUEST, CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_ORDER_BY_ID_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS, GET_ORDERS_FAILURE, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS } from "./ActionType"

const initialState={
orders:[],
order:null,
loading:false,
success:false,
error:null
}

export const orderReducer=(state=initialState,action)=>{
    switch(action.type){

        case CREATE_ORDER_REQUEST:
        case GET_ORDER_BY_ID_REQUEST:
        case GET_ORDERS_REQUEST:    
        case ADD_REVIEW_REQUEST:
            return { ...state,loading:true,error:null }

        case CREATE_ORDER_SUCCESS:
            return {    
                ...state,                                 
                loading:false,
                
                success:true,
                error:null,
                orders:[...state.orders, action.payload]
            }

        case GET_ORDER_BY_ID_SUCCESS:
            return {
                ...state,
                loading:false,
                error:null,
                order:action.payload
            }

         case GET_ORDERS_SUCCESS:
            return {
                ...state,
                loading:false,
                error:null,
                orders:action.payload
            }   

         case GET_ORDERS_SUCCESS:
            return {
                ...state,
                loading:false,
                error:null,
                
            }   


        case CREATE_ORDER_FAILURE:
        case GET_ORDER_BY_ID_FAILURE:
        case GET_ORDERS_FAILURE:
        case ADD_REVIEW_FAILURE:
            return {
              ...state,
                loading:false,
                error:action.payload
            }

        default:
            return state;
    }
}