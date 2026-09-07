import { Button, Grid, TextField, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../State/Auth/Action";
import GoogleIcon from "@mui/icons-material/Google";
import { OAUTH_BASE_URL } from "../../config/apiConfig";

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
    window.location.href = `${OAUTH_BASE_URL}/oauth2/authorization/google`;
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
        <Grid size={{ xs: 12 }}>
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
                borderColor: "#e11d54",
                bgcolor: "rgba(225,29,84, 0.08)",
              },
            }}
          >
            Continue with Google
          </Button>
        </Grid>

        {/* Custom Divider */}
        <Grid size={{ xs: 12 }}>
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

        <Grid size={{ xs: 12 }}>
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

        <Grid size={{ xs: 12 }}>
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

        <Grid size={{ xs: 12 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#ffffff",
              color: "#09090b",
              py: 1.3,
              fontSize: "0.95rem",
              borderRadius: "999px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#e4e4e7", boxShadow: "none" },
              "&:active": { transform: "scale(0.985)" },
            }}
          >
            {auth.isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Grid>
      </Grid>

      <p className="text-center mt-4 text-sm opacity-90">
        Don't have an account?{" "}
        <span
          className="text-[#e11d54] cursor-pointer ml-1 font-semibold hover:underline"
          onClick={switchMode}
        >
          Create Account
        </span>
      </p>
    </motion.form>
  );
};

export default LoginForm;