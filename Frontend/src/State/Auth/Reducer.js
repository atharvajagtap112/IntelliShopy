import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, lOGIN_SUCCESS, LOGOUT, REGISTOR_FAILURE, REGISTOR_REQUEST, REGISTOR_SUCCESS } from "./ActionType"

const initialState = {
    user:null,
    isLoading:false,
    error:null,
    jwt:null
}

export const authReaducer=(state=initialState,action)=>{
    
    switch(action.type){
        case REGISTOR_REQUEST:
        case LOGIN_REQUEST: 
        case GET_USER_REQUEST:
            return {...state,isLoading:true, error:null};  

        case REGISTOR_SUCCESS:
        case lOGIN_SUCCESS:
        return {...state, isLoading:false, error:null,jwt:action.payload,}
        
        case GET_USER_SUCCESS:
            return {...state,isLoading:false,user:action.payload, error:null};
        
        case REGISTOR_FAILURE:
        case LOGIN_FAILURE:
             return {...state,user:null,isLoading:false,error:action.payload,jwt:null};
        case GET_USER_FAILURE:
            // Reducers must stay pure - the localStorage write lived here and
            // fired on every failure. Clearing tokens is now the action's job,
            // and only for a real 401/403. A transient error keeps the session.
            return action.isAuthFailure
                ? { ...state, user: null, isLoading: false, error: action.payload, jwt: null }
                : { ...state, isLoading: false, error: action.payload };

        case LOGOUT :
            return{...initialState}   

        default:
            return state;   

}}