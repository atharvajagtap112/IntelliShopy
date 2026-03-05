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
  width: 440,
  maxWidth: "95vw",
  maxHeight: "95vh",
  overflowY: "auto",
  bgcolor: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  p: 4,
};

const AuthModal = ({ open, handleClose }) => {
  const [mode, setMode] = useState("login"); // login | register

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ 
            position: "absolute", 
            top: 12, 
            right: 12,
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "rgba(255, 255, 255, 1)",
              bgcolor: "rgba(255, 255, 255, 0.1)",
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography 
          variant="h5" 
          fontWeight="bold" 
          textAlign="center" 
          mb={3}
          sx={{ 
            fontSize: "1.5rem",
            letterSpacing: "-0.5px"
          }}
        >
          {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </Typography>

        <Typography 
          variant="body2" 
          textAlign="center" 
          mb={3}
          sx={{ 
            opacity: 0.8,
            fontSize: "0.9rem"
          }}
        >
          {mode === "login" 
            ? "Sign in to continue your shopping experience" 
            : "Join us and start shopping today"}
        </Typography>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm switchMode={() => setMode("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
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