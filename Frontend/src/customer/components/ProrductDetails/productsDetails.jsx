"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { Button, Grid, Rating } from "@mui/material";
import { motion } from "framer-motion";
import ProductReviewsCard from "./ProductReviewsCard";
import ProductRatingCard from "./ProductRatingCard";
import HomeSectionCarousel from "../HomeSectionCarosel/HomeSectionCarosel";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  findProductsByCategories,
  findProductsById,
  removeProduct,
} from "../../../State/Product/Action";
import { addItemToCart } from "../../../State/Cart/Action";
import { toast } from "react-toastify";
import Loading from "../Loading/loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { products } = useSelector((store) => store);

  const [selectedSize, setSelectedSize] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(removeProduct());
    const data = { productId: param.productId };
    dispatch(findProductsById(data));
  }, [param.productId, dispatch]);

  useEffect(() => {
    if (products?.product?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(products.product.sizes[0].name);
    }
  }, [products?.product?.sizes, selectedSize]);

  useEffect(() => {
    if (!products.product?.category?.name) return;
    const data = [
      {
        categoryTitle: "Selected Category",
        categoryName: products.product?.category?.name,
      },
    ];
    dispatch(findProductsByCategories(data));
  }, [dispatch, products.product?.category?.name]);

  const jwt = localStorage.getItem("jwt");

  const handleAddToCart = async () => {
    if (!jwt) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAddingToCart(true);

    const data = {
      productId:  param.productId,
      size: selectedSize,
      quantity: 1,
      price: products.product?.price,
    };

    try {
      await dispatch(addItemToCart(data));
      toast.success("Added to cart!");
      setTimeout(() => {
        navigate(`/cart`);
      }, 500);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  function getDiscountPercent(originalPrice, discountedPrice) {
    if (! originalPrice || originalPrice === 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  const averageRating =
    products.product?.reviews?.length === 0
      ? 0
      : (
          products.product?.reviews?.reduce((sum, r) => sum + r.rating, 0) /
          products.product?.reviews?.length
        ).toFixed(1);

  if (products.loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-white">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity:  1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  alt={products.product?.title}
                  src={products.product?.imageUrl}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            {/* Brand & Title */}
            <div className="space-y-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                {products.product?.brand}
              </motion.p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {products.product?.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <Rating
                  value={Number(averageRating)}
                  readOnly
                  precision={0.1}
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color:  '#000',
                    },
                  }}
                />
                <span className="text-sm font-semibold text-gray-900">
                  {averageRating}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                ({products?.product?.reviews?.length} reviews)
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-4 py-4 border-y border-gray-200">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">
                ₹{products.product?.discountPrice}
              </span>
              <span className="text-2xl text-gray-400 line-through">
                ₹{products.product?.price}
              </span>
              <span className="px-3 py-1 bg-black text-white font-bold text-sm rounded-md">
                {getDiscountPercent(
                  products.product?.price,
                  products.product?.discountPrice
                )}
                % OFF
              </span>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Size
                </h3>
                <button className="text-sm text-gray-900 hover:text-gray-700 font-medium underline">
                  Size Guide
                </button>
              </div>

              <RadioGroup
                value={selectedSize}
                onChange={setSelectedSize}
                className="grid grid-cols-4 sm:grid-cols-5 gap-3"
              >
                {products?.product?.sizes?.map((size) => (
                  <Radio
                    key={size.name}
                    value={size.name}
                    className={({ checked }) =>
                      classNames(
                        checked
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-900",
                        "relative flex items-center justify-center rounded-lg border-2 py-4 text-sm font-semibold uppercase cursor-pointer transition-all duration-200 focus:outline-none"
                      )
                    }
                  >
                    {size.name}
                  </Radio>
                ))}
              </RadioGroup>
            </div>

            {/* Add to Cart Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-4"
            >
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: "1.125rem",
                  fontWeight:  "600",
                  borderRadius:  "0.75rem",
                  background: "#000",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    background: "#1a1a1a",
                  },
                  "&:disabled": {
                    background: "#666",
                    opacity: 0.6,
                  },
                }}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    <span>Adding to Cart...</span>
                  </div>
                ) : (
                  <span>Add To Cart</span>
                )}
              </Button>
            </motion.div>

            {/* Product Description */}
            <div className="pt-6 space-y-4 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Product Details
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {products.product?.description}
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Reviews Section */}
     
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity:  1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 md:mt-24"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Customer Reviews
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            
              
                  <ProductRatingCard item={products.product?.reviews} />
                
              
            </div>
          </motion.section>
        
      </div>

      {/* Similar Products - Fixed Section */}
      {products?.productsByCategories?.[0]?.products?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity:  1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 md:mt-24 bg-gray-50 py-12 md:py-16"
        >
          <div className="max-w-8xl mx-auto">
            <HomeSectionCarousel
              data={products?.productsByCategories[0]?.products?.filter(
                (item) => item.id != param.productId
              )}
              sectionName="Similar Products"
            />
          </div>
        </motion.section>
      )}
    </div>
  );
}