import { CREATE_PAYMENT_REQUEST, CREATE_PAYMENT_SUCCESS, CREATE_PAYMENT_FAILURE, UPDATE_PAYMENT_REQUEST, UPDATE_PAYMENT_SUCCESS, UPDATE_PAYMENT_FAILURE } from "./ActionType"

const initialState = {
    payments: [],
    payment: null,
    loading: false,
    success: false,
    error: null,
    payment_link_url: null
}

export const paymentReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_PAYMENT_REQUEST:
   
            return { 
                ...state, 
                loading: true, 
                error: null,
                success: false 
            }

        case CREATE_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                error: null,
                payment: action.payload,
                payment_link_url: action.payload.payment_link_url,
                payments: [...state.payments, action.payload]
            }


        case CREATE_PAYMENT_FAILURE:
       
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload
            }

        default:
            return state;
    }
}