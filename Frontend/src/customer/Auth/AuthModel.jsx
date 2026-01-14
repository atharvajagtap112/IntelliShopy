import { Box, Modal, Typography, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistorForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

const AuthModal = ({ open, handleClose }) => {
  const [mode, setMode] = useState("login"); // login | register

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </Typography>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
            >
              <LoginForm switchMode={() => setMode("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <RegisterForm switchMode={() => setMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
};

export default AuthModal;
