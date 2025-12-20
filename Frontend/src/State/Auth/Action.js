import axios from "axios"
import { API_BASE_URL } from "../../config/apiConfig"
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, lOGIN_SUCCESS, LOGOUT, REGISTOR_FAILURE, REGISTOR_REQUEST, REGISTOR_SUCCESS } from "./ActionType";
import { toast } from "react-toastify";

const token=localStorage.getItem("jwt");

const registerRequest=()=>({type:REGISTOR_REQUEST});
const registerSuccess=(user)=>({type:REGISTOR_SUCCESS, payload:user});
const registerFailure=(error)=>({type:REGISTOR_FAILURE, payload:error});

export const register=(userData)=> async (dispatch)=>{
    try{
        dispatch(registerRequest());
        const response= await axios.post(`${API_BASE_URL}/auth/signup`,userData);
         const user=response.data;
         if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
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
        const response= await axios.post(`${API_BASE_URL}/auth/signin`,userData);
         const user=response.data;
         console.log(user);
         if(user.jwt){
            localStorage.setItem("jwt",user.jwt);
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
const getUserFailure=(error)=>({type:GET_USER_FAILURE, payload:error});

export const getUser=(jwt)=> async (dispatch)=>{
    try{
        dispatch(getUserRequest());
        const response= await axios.get(`${API_BASE_URL}/api/users/profile`,{
          headers:{
            "Authorization":`Bearer ${jwt} `
          }
        })
         const user=response.data;
        console.log("user ", user);

       dispatch(getUserSuccess(user));         
     }
    catch(error){
      console.log("Error fetching user  get user Function:", error);
      dispatch(getUserFailure(error.message))
    }
  }

  export const logout=()=> (dispatch)=>{
    dispatch({type:LOGOUT,payload:null});
   }
  
  

