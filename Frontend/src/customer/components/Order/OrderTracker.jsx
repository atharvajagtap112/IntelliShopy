import {  Step, StepLabel, Stepper } from '@mui/material'

const steps=[
    "Placed",
    "Order Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered"
]

const OrderTracker = ({activeStep}) => {
  return (
    <div>
    <Stepper activeStep={activeStep} alternativeLabel>
       {steps.map((lable)=>
    <Step>
        <StepLabel SX={{colors:"#9155fd" , fontSize:"44px"}}> 
             {lable}
        </StepLabel >
    </Step>
    )}
    </Stepper>
    </div>
  )
}

export default OrderTracker