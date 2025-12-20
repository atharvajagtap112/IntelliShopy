import { Button, Grid, TextField } from '@mui/material'
import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, register } from '../../State/Auth/Action';
 

const RegistorForm = () => {
 
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const jwt=localStorage.getItem("jwt");
 const {auth}=useSelector(store=>store)
     
 useEffect(() => {
  if(jwt){
    dispatch(getUser(jwt))
  } 
},[jwt,auth.jwt]
 )


    const handleSubmit = (event) => {
        event.preventDefault();
         
        const data=new FormData(event.currentTarget);

        const userData={
            firstName:data.get('firstName'),
            lastName:data.get('lastName'),  
            email:data.get('email'),
            password:data.get('password'),
        }

        dispatch(register(userData));
        console.log(userData);
       }
    return (
    <div>
       <form onSubmit={handleSubmit}>
  <Grid container spacing={3} width={"100%"} >
    <Grid flex={1} item xs={12} sm={6}>
      <TextField 
      
        required
        id="firstName"
        name="firstName"
        label="First Name"
        fullWidth
        autoComplete="given-name"
      />

      
    </Grid>

    <Grid   item xs={12} sm={6}>
      <TextField 
        required
        id="lastName"
        name="lastName"
        label="Last Name"
        fullWidth
        autoComplete="family-name"
      />
    </Grid>

    <Grid item xs={12}  width={"100%"}>
      <TextField 
        required
        id="email"
        name="email"
        label="Email"
        fullWidth
        autoComplete="email"
      />
    </Grid>

    <Grid item xs={12} width={"100%"}>
      <TextField 
        required
        id="password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        autoComplete="new-password"
      />
    </Grid>

   
      <Button
        className='bg-[#9155FD] w-full'
        type='submit'
        variant='contained'
        size='large'
        sx={{ padding: ".8rem 0", bgcolor: "#9155FD" }}
      >

      {auth.isLoading ? (
  <div className="flex items-center justify-center space-x-2">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    </div>
    <span className="text-white font-medium">Creating account...</span>
  </div>
) : (
  "Register"
)}
      </Button>
   
  </Grid>
</form>

<div className='flex justify-center flex-col items-center'>
    <div className='py-3 flex item-center'>
        <p >
        if you have already account ?</p>
        <Button onClick={()=>navigate("/login")}   className='ml-5' size='small'     >LOGIN</Button>
    </div>
</div>
    </div>
  )
}

export default RegistorForm