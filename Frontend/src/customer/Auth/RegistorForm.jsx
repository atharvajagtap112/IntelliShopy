import { Button, Grid, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../State/Auth/Action";

const RegisterForm = ({ switchMode }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    dispatch(
      register({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
      })
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField label="First Name" name="firstName" fullWidth required />
        </Grid>

        <Grid item xs={6}>
          <TextField label="Last Name" name="lastName" fullWidth required />
        </Grid>

        <Grid item xs={12}>
          <TextField label="Email" name="email" fullWidth required />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#9155FD",
              py: 1.3,
              fontSize: "1rem",
              borderRadius: "10px",
            }}
          >
            {auth.isLoading ? "Creating account..." : "Register"}
          </Button>
        </Grid>
      </Grid>

      <p className="text-center mt-4 text-sm">
        Already have an account?
        <span
          className="text-[#9155FD] cursor-pointer ml-1"
          onClick={switchMode}
        >
          Login
        </span>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
