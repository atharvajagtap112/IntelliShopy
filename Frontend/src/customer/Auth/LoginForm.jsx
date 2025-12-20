import { Button, Grid, TextField } from "@mui/material";
import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, login } from "../../State/Auth/Action";
import { authReaducer } from "../../State/Auth/Reducer";
import { store } from "../../State/store";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const {auth}=useSelector(store =>store)

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userData = {
   
      email: data.get("email"),
      password: data.get("password"),
    };

    dispatch(login(userData))

    console.log(userData);
  };

  useEffect(() => {

  }, [auth.isLoading]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} width={"100%"}>
          <Grid item xs={12} width={"100%"}>
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
            className="bg-[#9155FD] w-full"
            type="submit"
            variant="contained"
            size="large"
            sx={{ padding: ".8rem 0", bgcolor: "#9155FD" }}
          >
           {auth.isLoading ? (
  <div className="flex items-center justify-center space-x-2">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    </div>
    <span className="text-white font-medium">Signing in...</span>
  </div>
) : (
  <p>Login</p>
)}
          
          
          </Button>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center">
        <div className="py-3 flex item-center">
          <p>if you dont't have account ?</p>
          <Button
            onClick={() => navigate("/register")}
            className="ml-5"
            size="small"
          >
            REGISTER
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
