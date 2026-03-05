import { Button, Grid, TextField, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../State/Auth/Action";
import GoogleIcon from "@mui/icons-material/Google";
import { API_BASE_URL } from "../../config/apiConfig";

const LoginForm = ({ switchMode }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    dispatch(
      login({
        email: data.get("email"),
        password: data.get("password"),
      })
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  const inputStyles = {
    backgroundColor: "transparent",
    "& input": {
      backgroundColor: "transparent",
      color: "inherit",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px transparent inset",
      WebkitTextFillColor: "inherit",
      transition: "background-color 9999s ease-in-out 0s",
    },
    "& input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 1000px transparent inset",
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Grid container spacing={2}>
        {/* Google Sign-In Button - First */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <GoogleIcon sx={{ fontSize: "20px !important" }} />
            }
            onClick={handleGoogleLogin}
            sx={{
              py: 1.2,
              fontSize: "0.95rem",
              borderRadius: "10px",
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "inherit",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#9155FD",
                bgcolor: "rgba(145, 85, 253, 0.08)",
              },
            }}
          >
            Continue with Google
          </Button>
        </Grid>

        {/* Custom Divider */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            my: 1
          }}>
            <Box sx={{ 
              flex: 1, 
              height: '1px', 
              bgcolor: 'rgba(255, 255, 255, 0.2)' 
            }} />
            <Box sx={{ 
              fontSize: '0.75rem', 
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
              px: 1
            }}>
              OR
            </Box>
            <Box sx={{ 
              flex: 1, 
              height: '1px', 
              bgcolor: 'rgba(255, 255, 255, 0.2)' 
            }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField 
            label="Email" 
            name="email" 
            fullWidth 
            required 
            slotProps={{
              input: {
                sx: inputStyles
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            slotProps={{
              input: {
                sx: inputStyles
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#9155FD",
              py: 1.2,
              fontSize: "0.95rem",
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(145, 85, 253, 0.4)",
              "&:hover": {
                bgcolor: "#7c3aed",
                boxShadow: "0 6px 20px rgba(145, 85, 253, 0.5)",
              },
            }}
          >
            {auth.isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Grid>
      </Grid>

      <p className="text-center mt-4 text-sm opacity-90">
        Don't have an account?{" "}
        <span
          className="text-[#9155FD] cursor-pointer ml-1 font-semibold hover:underline"
          onClick={switchMode}
        >
          Create Account
        </span>
      </p>
    </motion.form>
  );
};

export default LoginForm;