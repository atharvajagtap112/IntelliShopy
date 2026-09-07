import { api } from "../../config/apiConfig"
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, lOGIN_SUCCESS, LOGOUT, REGISTOR_FAILURE, REGISTOR_REQUEST, REGISTOR_SUCCESS } from "./ActionType";
import { toast } from "react-toastify";



const registerRequest=()=>({type:REGISTOR_REQUEST});
const registerSuccess=(user)=>({type:REGISTOR_SUCCESS, payload:user});
const registerFailure=(error)=>({type:REGISTOR_FAILURE, payload:error});

export const register=(userData)=> async (dispatch)=>{
    try{
        dispatch(registerRequest());
        const response= await api.post(`/auth/signup`,userData);
         const user=response.data;
         if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
         }
         if(user.refreshToken){
            localStorage.setItem("refreshToken",user.refreshToken);
         }
       console.log(user);
       dispatch(registerSuccess(user.jwt));
     }
    catch(error){
       toast.error("Registration failed. Please try again.");
      dispatch(registerFailure(error.message))
    }}


 const loginRequest=()=>({type:LOGIN_REQUEST});
const loginSuccess=(user)=>({type:lOGIN_SUCCESS, payload:user});
const loginFailure=(error)=>({type:LOGIN_FAILURE, payload:error});

    export const login=(userData)=> async (dispatch)=>{
    try{
        dispatch(loginRequest());
        const response= await api.post(`/auth/signin`,userData);
         const user=response.data;
         console.log(user);
         if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
         }
         if(user.refreshToken){
            localStorage.setItem("refreshToken",user.refreshToken);
         }

       dispatch(loginSuccess(user.jwt));
     }
    catch(error){
      toast.error("Login failed. Please check your credentials.");
      dispatch(loginFailure(error.message))
    }
  }

   const getUserRequest=()=>({type:GET_USER_REQUEST});
const getUserSuccess=(user)=>({type:GET_USER_SUCCESS, payload:user});
const getUserFailure=(error, isAuthFailure=false)=>({type:GET_USER_FAILURE, payload:error, isAuthFailure});

export const getUser=(jwt)=> async (dispatch)=>{
    try{
        dispatch(getUserRequest());
        // No explicit header: the api instance's request interceptor already
        // attaches the token. The hand-rolled one here had a trailing space
        // after ${jwt}, which some parsers reject outright.
        const response = await api.get(`/api/users/profile`)
         const user=response.data;
        console.log("user ", user);

       dispatch(getUserSuccess(user));         
     }
    catch(error){
      // Only a genuine auth rejection should end the session. Previously ANY
      // error - a 429 from the gateway's rate limiter, a 5xx, a dropped
      // connection - deleted the JWT, which is why sessions died in minutes.
      const status = error.response?.status;
      const isAuthFailure = status === 401 || status === 403;
      if (isAuthFailure) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
      }
      console.log("getUser failed:", status ?? error.message, isAuthFailure ? "(session ended)" : "(session kept)");
      dispatch(getUserFailure(error.message, isAuthFailure));
    }
  }

  export const logout=()=> async (dispatch)=>{
    const refreshToken=localStorage.getItem("refreshToken");
    try{
      // Tell the backend to destroy the refresh token so it can't be reused.
      if(refreshToken){
        await api.post(`/auth/logout`,{refreshToken});
      }
    }catch(error){
      console.log("Logout revoke failed (clearing locally anyway):",error.message);
    }
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    dispatch({type:LOGOUT,payload:null});
   }
  
  

