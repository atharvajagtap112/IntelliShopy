import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, MenuItem, FormHelperText } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../State/Order/Action";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { State, City } from 'country-state-city';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PublicIcon from '@mui/icons-material/Public';

const DeliveryAddressForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: ''
  });

  const [errors, setErrors] = useState({
    mobile: '',
    zipCode: ''
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState('');
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((store) => store);

  // Load Indian states on component mount
  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  // Phone number validation (Indian format)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Zip code validation (Indian PIN code:  6 digits)
  const validateZipCode = (zip) => {
    const zipRegex = /^[1-9][0-9]{5}$/;
    return zipRegex.test(zip);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]:  value
    }));

    // Real-time validation for phone
    if (name === 'mobile' && value.length === 10) {
      if (!validatePhoneNumber(value)) {
        setErrors(prev => ({ 
          ...prev, 
          mobile: 'Please enter a valid 10-digit mobile number' 
        }));
      }
    }

    // Real-time validation for zip code
    if (name === 'zipCode' && value.length === 6) {
      if (!validateZipCode(value)) {
        setErrors(prev => ({ 
          ...prev, 
          zipCode: 'Please enter a valid 6-digit PIN code' 
        }));
      }
    }
  };

  // Handle only numeric input for phone and zipCode
  const handleNumericInput = (e) => {
    const { name, value } = e.target;
    // Only allow digits
    const numericValue = value.replace(/\D/g, '');
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));

    // Real-time validation for phone
    if (name === 'mobile' && numericValue.length === 10) {
      if (!validatePhoneNumber(numericValue)) {
        setErrors(prev => ({ 
          ...prev, 
          mobile: 'Mobile number must start with 6, 7, 8, or 9' 
        }));
      }
    }

    // Real-time validation for zip code
    if (name === 'zipCode' && numericValue.length === 6) {
      if (!validateZipCode(numericValue)) {
        setErrors(prev => ({ 
          ...prev, 
          zipCode: 'Please enter a valid PIN code' 
        }));
      }
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find(s => s.isoCode === stateCode);
    
    setSelectedStateCode(stateCode);
    setFormData(prev => ({
      ...prev,
      state: selectedState?.name || '',
      city: '' // Reset city when state changes
    }));

    // Get cities for selected state
    if (stateCode) {
      const stateCities = City.getCitiesOfState('IN', stateCode);
      console.log(`Loading cities for ${selectedState?.name}:`, stateCities.length);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(formData.mobile)) {
      setErrors(prev => ({ 
        ...prev, 
        mobile: 'Please enter a valid 10-digit mobile number starting with 6-9' 
      }));
      return;
    }

    // Validate zip code
    if (!validateZipCode(formData.zipCode)) {
      setErrors(prev => ({ 
        ...prev, 
        zipCode: 'Please enter a valid 6-digit PIN code' 
      }));
      return;
    }

    // If all validations pass, submit the form
    console.log('Submitting form data:', formData);
    dispatch(createOrder({
      orderData: formData,
      navigate:  navigate  
    }));
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fafafa',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '& input': { color: '#fafafa' },
      '& .MuiSelect-select': { color: '#fafafa' },
      '& .MuiSelect-icon': { color: '#a1a1aa' },
      '& textarea': { color: '#fafafa' },
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.14)',
        borderWidth: '1px',
      },
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.08)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.30)' },
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255,255,255,0.08)',
        '& fieldset': {
          borderColor: '#e11d54',
          borderWidth: '2px',
        },
      },
      '&.Mui-error': {
        '& fieldset': {
          borderColor: '#ef4444',
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: '#a1a1aa',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#fb7191',
        fontWeight: 600,
      },
      '&.Mui-error': {
        color: '#ef4444',
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity:  1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white/[0.07] border-b border-white/10 px-6 md:px-8 py-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 32, color:  'white' }} />
            </motion.div>
            <div>
              <h2 className="text-2xl md: text-3xl font-bold text-white">
                Delivery Address
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Where should we deliver your order?
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} spellCheck={false}>
            <Grid container spacing={3}>
              
              {/* Name Section */}
              <Grid size={{ xs: 12 }}>
                <motion. div
                  initial={{ opacity:  0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <PersonOutlineIcon className="text-zinc-300" />
                  <h3 className="text-lg font-bold text-white">Personal Information</h3>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TextField
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    autoComplete="given-name"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    sx={textFieldStyles}
                  />
                </motion. div>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextField
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    autoComplete="family-name"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    sx={textFieldStyles}
                  />
                </motion.div>
              </Grid>

              {/* Address Section */}
              <Grid size={{ xs: 12 }}>
                <motion.div
                  initial={{ opacity: 0, x:  -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 mt-8"
                >
                  <HomeOutlinedIcon className="text-zinc-300" />
                  <h3 className="text-lg font-bold text-white">Address Details</h3>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TextField
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    required
                    autoComplete="street-address"
                    label="Street Address"
                    placeholder="House no., Building name, Street name"
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    sx={textFieldStyles}
                  />
                </motion.div>
              </Grid>

              {/* State Dropdown */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <motion. div
                  initial={{ opacity:  0, y: 20 }}
                  animate={{ opacity:  1, y: 0 }}
                  transition={{ delay:  0.6 }}
                >
                  <TextField
                    select
                    id="state"
                    name="state"
                    value={selectedStateCode}
                    onChange={handleStateChange}
                    required
                    label="State / Union Territory"
                    variant="outlined"
                    fullWidth
                    sx={textFieldStyles}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            borderRadius: 2,
                            mt: 1,
                            bgcolor: '#18181b',
                            backgroundImage: 'none',
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
                            '& .MuiMenuItem-root': {
                              color: '#e4e4e7',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(225,29,84,0.20)',
                                '&:hover': { backgroundColor: 'rgba(225,29,84,0.28)' },
                              },
                            },
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em className="flex items-center gap-2 text-zinc-500">
                        <PublicIcon fontSize="small" />
                        Select State
                      </em>
                    </MenuItem>
                    {states.map((state) => (
                      <MenuItem 
                        key={state.isoCode} 
                        value={state.isoCode}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.06)',
                          },
                          '&. Mui-selected': {
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.18)',
                            },
                          },
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <MapOutlinedIcon fontSize="small" />
                          {state.name}
                        </div>
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormHelperText sx={{ ml: 2, color: '#6b7280' }}>
                    {states.length} states and union territories
                  </FormHelperText>
                </motion.div>
              </Grid>

              {/* City Dropdown */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <TextField
                    select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    required
                    label="City"
                    variant="outlined"
                    fullWidth
                    disabled={!selectedStateCode}
                    sx={textFieldStyles}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            borderRadius: 2,
                            mt: 1,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em className="text-zinc-500">
                        {selectedStateCode ? 'Select City' : 'First select a state'}
                      </em>
                    </MenuItem>
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <MenuItem 
                          key={city.name} 
                          value={city.name}
                          sx={{
                            '&:hover':  {
                              backgroundColor: 'rgba(255,255,255,0.06)',
                            },
                            '&. Mui-selected': {
                              backgroundColor: 'rgba(255,255,255,0.12)',
                              fontWeight:  600,
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.18)',
                              },
                            },
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <LocationCityOutlinedIcon fontSize="small" />
                            {city.name}
                          </div>
                        </MenuItem>
                      ))
                    ) : selectedStateCode ? (
                      <MenuItem disabled>
                        <em className="text-zinc-500">No cities found for this state</em>
                      </MenuItem>
                    ) : null}
                  </TextField>
                  <FormHelperText sx={{ ml: 2, color:  '#6b7280' }}>
                    {selectedStateCode 
                      ? `${cities.length} ${cities.length === 1 ?  'city' : 'cities'} available`
                      : 'Please select a state first'
                    }
                  </FormHelperText>
                </motion.div>
              </Grid>

              {/* Contact Section */}
              <Grid size={{ xs: 12 }}>
                <motion. div
                  initial={{ opacity:  0, x: -20 }}
                  animate={{ opacity:  1, x: 0 }}
                  transition={{ delay:  0.8 }}
                  className="flex items-center gap-2 mt-8"
                >
                  <PhoneOutlinedIcon className="text-zinc-300" />
                  <h3 className="text-lg font-bold text-white">Contact Information</h3>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <motion. div
                  initial={{ opacity:  0, y: 20 }}
                  animate={{ opacity:  1, y: 0 }}
                  transition={{ delay:  0.9 }}
                >
                  <TextField
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleNumericInput}
                    required
                    label="PIN Code"
                    variant="outlined"
                    fullWidth
                    inputProps={{ 
                      maxLength: 6,
                      inputMode: "numeric"
                    }}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode || "6-digit PIN code"}
                    sx={textFieldStyles}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y:  20 }}
                  animate={{ opacity: 1, y:  0 }}
                  transition={{ delay: 1.0 }}
                >
                  <TextField
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleNumericInput}
                    required
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ 
                      maxLength: 10,
                      inputMode: "numeric"
                    }}
                    error={!!errors.mobile}
                    helperText={errors.mobile || "10-digit mobile number (e.g., 9876543210)"}
                    sx={textFieldStyles}
                  />
                </motion.div>
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4"
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={order.loading || !!errors.mobile || !!errors.zipCode}
                    sx={{
                      bgcolor: 'black',
                      color: 'white',
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      '&:hover': {
                        bgcolor: '#1a1a1a',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                      },
                      '&.Mui-disabled':  {
                        bgcolor: '#6b7280',
                        color: 'white',
                      },
                    }}
                  >
                    {order.loading ?  (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-white font-medium">Processing...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <LocalShippingOutlinedIcon />
                        Continue to Order Summary
                      </span>
                    )}
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </form>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white/5 px-6 md:px-8 py-4 border-t border-white/10"
        >
          <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500/100 rounded-full animate-pulse"></span>
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500/100 rounded-full animate-pulse"></span>
              Fast Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-500/100 rounded-full animate-pulse"></span>
              Easy Returns
            </div>
          </div>
        </motion. div>
      </div>
    </motion.div>
  );
};

export default DeliveryAddressForm;