import React, { useState } from 'react';
import { 
  Grid, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Footer = () => {
  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = (modalType) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

 const modalContent = {
  about: {
    title: "About Us",
    content: (
      <div>
        <Typography paragraph>
          Welcome to <strong>IntelliShop</strong>, an AI-powered e-commerce platform built in 2025 to showcase an intelligent, seamless shopping experience.
        </Typography>
        <Typography paragraph>
          Developed using React, Tailwind CSS, MUI, Spring Boot, Spring Security, and MySQL, IntelliShop integrates AI-driven search (via Gemini API and WebSocket), JWT-based authentication.
        </Typography>
        
      </div>
    )
  },
  supports: {
    title: "Customer Support",
    content: (
      <div>
        <Typography paragraph>
          <strong>Need Help? This demo includes mock support features.</strong>
        </Typography>
        <Typography paragraph>
          📞 <strong>Phone Support:</strong> 1-800-INTELLI (Mock Only)
        </Typography>
        <Typography paragraph>
          📧 <strong>Email:</strong> support@intellishop.demo (Not monitored)
        </Typography>
        <Typography paragraph style={{ marginTop: '16px' }}>
          <strong>Return Policy:</strong> For demonstration purposes only.
        </Typography>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div>
        <Typography paragraph>
          <strong>Your Privacy Matters – Even in a Demo</strong>
        </Typography>
       
        <Typography paragraph>
          Last updated: January 2025
        </Typography>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div>
        <Typography paragraph>
          <strong>Terms & Conditions (Demo Only)</strong>
        </Typography>
        <Typography paragraph>
          By using IntelliShop, you agree that this is a demo project built for educational purposes with mock data and simulated workflows.
        </Typography>
        <Typography paragraph>
          <strong>Accounts & Orders:</strong>
        </Typography>
        <Typography component="div">
          • No real account creation required<br/>
          • Use test credentials<br/>
          • Orders, shipping, and payments are simulated
        </Typography>
        <Typography paragraph style={{ marginTop: '16px' }}>
          <strong>Payments & Reviews:</strong>
        </Typography>
        <Typography component="div">
          • Razorpay integration mimics real payments<br/>
          • Add product reviews once simulated delivery is complete
        </Typography>
        <Typography paragraph style={{ marginTop: '16px' }}>
          <strong>Disclaimer:</strong> This site is for demonstration only.
        </Typography>
        <Typography paragraph>
          Last updated: January 2025
        </Typography>
      </div>
    )
  }
};



  return (
    <div className="bg-black">
      <Grid
        className="text-center text-white bg-black mt-10"
        container
        justifyContent="center"
        spacing={3}
        sx={{ bgcolor: "black", color: "white", py: 3 }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <div>
            <Button 
              className="py-5 text-white hover:text-gray-300" 
              variant="text"
              onClick={() => handleOpenModal('about')}
              sx={{ color: 'white', '&:hover': { color: '#d1d5db' } }}
            >
              About
            </Button>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <div>
            <Button 
              className="py-5 text-white hover:text-gray-300" 
              variant="text"
              onClick={() => handleOpenModal('supports')}
              sx={{ color: 'white', '&:hover': { color: '#d1d5db' } }}
            >
              Support
            </Button>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <div>
            <Button 
              className="py-5 text-white hover:text-gray-300" 
              variant="text"
              onClick={() => handleOpenModal('privacy')}
              sx={{ color: 'white', '&:hover': { color: '#d1d5db' } }}
            >
              Privacy
            </Button>
          </div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <div>
            <Button 
              className="py-5 text-white hover:text-gray-300" 
              variant="text"
              onClick={() => handleOpenModal('terms')}
              sx={{ color: 'white', '&:hover': { color: '#d1d5db' } }}
            >
              Terms
            </Button>
          </div>
        </Grid>
      </Grid>

      <Grid className="pt-10" item xs={12}>
        <Typography variant="body2" component="p" align="center" className="text-white">
          All rights reserved.
        </Typography>
        <Typography variant="body2" component="p" align="center" className="text-white">
          Made with love by Me.
        </Typography>
      </Grid>

      {/* Modal Dialog */}
      <Dialog
        open={openModal !== null}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'white',
            color: 'black'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {openModal && modalContent[openModal]?.title}
          <IconButton
            onClick={handleCloseModal}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {openModal && modalContent[openModal]?.content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Footer;