import React, { useState } from 'react';
import { 
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



  const links = [
    ["About", "about"],
    ["Support", "supports"],
    ["Privacy", "privacy"],
    ["Terms", "terms"],
  ];

  return (
    <div className="bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-12 border-b border-white/10 pb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-3xl font-semibold tracking-tighter text-white">
              IntelliShopy
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              AI-powered fashion discovery — search by text, by image, or just by
              vibe. Built as a full-stack demo.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {links.map(([label, key]) => (
              <button
                key={key}
                onClick={() => handleOpenModal(key)}
                className="text-sm font-medium text-zinc-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs sm:flex-row">
          <span>&copy; {new Date().getFullYear()} IntelliShopy. All rights reserved.</span>
          <span>Made with care.</span>
        </div>
      </div>

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