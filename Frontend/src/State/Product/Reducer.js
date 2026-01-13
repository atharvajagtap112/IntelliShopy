import { FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCT_FAILURE, FIND_PRODUCT_REQUEST, FIND_PRODUCT_SUCCESS, FIND_PRODUCTS_BY_CATEGORY_FAILURE, FIND_PRODUCTS_BY_CATEGORY_SUCCESS, FIND_PRODUCTS_BY_CATEGORYS_REQUEST, REMOVE_PRODUCT } from "./ActionType"

const initialState = {
    products:[],
    product: null,
    loading: false,
    error: null,
    productsByCategories:[]
    
}


export const customerProductReducer = (state =initialState, action) => {
    
    switch (action.type) {

      case REMOVE_PRODUCT:
        return {
          ...state,
          product: null,
        };
       
        case FIND_PRODUCT_REQUEST:
           
        return{
            ...state,product: null, products:[], loading:true, error:null
        }

          case FIND_PRODUCTS_BY_CATEGORYS_REQUEST:
           case FIND_PRODUCT_BY_ID_REQUEST:
             return{
                ...state, loading:true, error:null
            }  

        case FIND_PRODUCT_SUCCESS:
          return{
                  ...state,
                  loading:false,
                  products: action.payload,
                }

        case FIND_PRODUCT_BY_ID_SUCCESS:
                return{
                  ...state,
                  loading:false,
                  product: action.payload,
                }
         
          case FIND_PRODUCTS_BY_CATEGORY_SUCCESS:
            return{
                  ...state,
                  loading:false,
                  productsByCategories: action.payload,
                }      

        case FIND_PRODUCT_FAILURE:
          case FIND_PRODUCTS_BY_CATEGORY_FAILURE:
            case FIND_PRODUCT_BY_ID_FAILURE:
                 return{
                   ...state,
                   loading:false,
                     error: action.payload,
                 }           

         default:
            return state;        
    }

}