import { Button, IconButton } from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDispatch } from "react-redux";
import { removeItemFromCart, removeItemToCart, updateItemToCart } from "../../../State/Cart/Action";
const CardItem = ({item,isCheckout}) => {

  const findDiscount = (price, discountPrice) => {
    if (price && discountPrice) {
      const discount = ((price - discountPrice) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  }
const dispatch = useDispatch();

  const updateCartItem=(num)=>{
   
     const data={
         data:{
              quantity:item.quantity+num
         },
          cartItemId:item?.id}

          dispatch(updateItemToCart(data))
  }

  const handleRemoveItem = () => {
    dispatch(removeItemFromCart(item.id))
  }

  return (
    <div className="p-5 mb-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        <div className="w-[8rem] h-[8rem] lg:w-[9rem] lg:h[9rem">
          <img
            className="w-full h-full object-cover object-top "
            src={item.product.imageUrl}
            alt=""
          />
        </div>

        <div className="ml-3 space-y-1 text-left">
          <p className="font-semibold">{item.product.title}</p>
          <p className="opacity-70">Size: {item.size} </p>
          <p className="opacty-70 mt-2">Seller: {item.product.brand}</p>
          <div className="flex space-x-5 items-center text-gray-900 pt-6">
          <p className="font-semibold">₹ {item.discountedPrice}</p>
          <p className="opacity-50 line-through">₹{item.price}</p>
          <p className="font-semibold text-green-600">{findDiscount(item.product.price,item.product.discountPrice)}% off</p>
          </div>
        </div> 
        </div>
           
           { isCheckout ? null :
           <div className="lg:flex items-center lg:space-x-2 pt-4 align-left">
             <div className="flex item-center space-x-2"></div>
              <IconButton onClick={()=>updateCartItem(-1)} 
              disabled={item.quantity<=1}
              >
                <RemoveCircleOutlineIcon className="text-gray-500" />
              </IconButton>
              <span className="py-1 px-5 border rounded-sm">{item.quantity} </span>
                 <IconButton sx={{ color: "RGB(145 85 253)" }}  
                  onClick={()=>updateCartItem(1)} 
      
                 >
                  <AddCircleOutlineIcon></AddCircleOutlineIcon>
                 </IconButton>
              <div> 
               
                  <Button 
                  onClick={handleRemoveItem}
                  sx={{ color: "RGB(145 85 253)"}}>
                     Remove
                  </Button>
                </div>
            </div>  }

               


     
    </div>
  );
};

export default CardItem;
