import React from 'react'
import "./ProductCard.css"
import { useNavigate } from 'react-router-dom'
export const ProductCard = ({product}) => {
   const navigate=useNavigate();
  return (
    <div onClick={()=>navigate(`/product/${product.id}`)} className='productCard w-[15rem] m-3 transition-all border border-gray-200 cursor-pointer pb-5' >
      <div className='h-[20rem]'> {/* Added fixed height */}
        <img className='w-full h-full object-cover object-left-top'
        src={product.imageUrl} 
        alt="" />
      </div>

      <div className='textPart bg-white p-3'>
        <div className='space-x-2'>
         <p className='font-bold opacity-60 text-left'>{product.brand}</p>
         <p className='text-left'>{product.title}</p>
         </div> 

         <div className='flex items-left space-x-2'>
          <p className='font-semibold'>₹{product.discountPrice}</p>
          <p className='line-through opacity-50'>₹{product.price}</p>
          <p className='text-green-600 font-semibold'>
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
          </p>
         </div>
      </div>
    </div>
  )
}

export default ProductCard