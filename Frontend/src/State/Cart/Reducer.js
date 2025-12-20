import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, REMOVE_ITEM_FROM_CART_FAILURE, REMOVE_ITEM_FROM_CART_REQUEST, REMOVE_ITEM_FROM_CART_SUCCESS, UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType"

const initialState = {
cart:null,

loading: false,
error: null,
cartItems:[]
}

export const cartReducer = (state =initialState , action) => {
    switch(action.type){
       
        case GET_CART_REQUEST:
            case ADD_ITEM_TO_CART_REQUEST:
               case REMOVE_ITEM_FROM_CART_REQUEST:
                  case UPDATE_CART_ITEM_REQUEST:
                       return {...state, loading:true, error:null } 
        
        
        case ADD_ITEM_TO_CART_SUCCESS:
            return {
                ...state,
                loading:false,
                cartItem:[...state.cartItems,action.payload.cartItem],
                
            }
            
        case ADD_ITEM_TO_CART_FAILURE:
            return{...state,loading:false, error:action.payload} 
        
        case GET_CART_SUCCESS:
            return{
                ...state,
                loading:false,
                error:null,
                cartItems:action.payload.cartItems,
                cart:action.payload
            }

        case GET_CART_FAILURE:
            return {
                ...state,
                loading:false,
                error:action.payload
            }

       case REMOVE_ITEM_FROM_CART_SUCCESS:
            return {
                ...state,
                loading:false,
                error:null,
                deleteItem:action.payload
            }

        case UPDATE_CART_ITEM_SUCCESS:
            return {
                ...state,
                loading:false,
               
                 updateCart: action.payload}
                
             

        case REMOVE_ITEM_FROM_CART_FAILURE:
           case UPDATE_CART_ITEM_FAILURE:
               return{
                ...state,
                loading:false,
                error:action.payload
               }          

        default:
            return state; 


                       
                       
    }
}