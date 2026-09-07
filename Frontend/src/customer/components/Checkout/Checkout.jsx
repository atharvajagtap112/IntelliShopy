
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useLocation } from 'react-router-dom';
import DeliveryAddressForm from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const steps = ['Login', 'Delivery Address', 'Order Summary', 'Payment'];

// Custom Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #000000, #333333)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #000000, #333333)',
    },
  },
  [`&.${stepConnectorClasses.line}`]: {
    height: 3,
    border:  0,
    backgroundColor: '#e0e0e0',
    borderRadius: 1,
  },
}));

// Custom Step Icon
const CustomStepIcon = (props) => {
  const { active, completed, className } = props;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={className}
    >
      {completed ? (
        <motion.div
          initial={{ rotate: 0, scale: 0 }}
          animate={{ rotate: 360, scale:  1 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg"
        >
          <CheckCircleIcon sx={{ color: 'white', fontSize: 28 }} />
        </motion.div>
      ) : active ? (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center shadow-xl ring-4 ring-accent-500/25"
        >
          <span className="text-white font-bold text-lg">{props.icon}</span>
        </motion. div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/15">
          <span className="text-zinc-400 font-semibold text-lg">{props.icon}</span>
        </div>
      )}
    </motion.div>
  );
};

export default function Checkout() {
  const location = useLocation();
  const querySearch = new URLSearchParams(location.search);
  const step = parseInt(querySearch.get("step")) || 1;

  return (
    <div className="min-h-screen bg-zinc-950 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Complete your order in a few simple steps
          </p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <Box className="bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-8 border border-white/10">
            <Stepper 
              activeStep={step - 1} 
              alternativeLabel
              connector={<CustomConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconComponent={CustomStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        marginTop: '8px',
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        color: step - 1 >= index ? '#000' : '#9ca3af',
                      },
                      '& .MuiStepLabel-label.Mui-active': {
                        color: '#000',
                        fontWeight: 700,
                      },
                      '& .MuiStepLabel-label.Mui-completed': {
                        color: '#000',
                        fontWeight:  600,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.4 }}
        >
          {step === 2 ?  <DeliveryAddressForm /> :  <OrderSummary />}
        </motion.div>
      </div>
    </div>
  );
}