/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    theme: {
      extend: {
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
      },
    },
  }
  ```
*/
"use client";

import { use, useEffect, useState } from "react";
import { BellAlertIcon, StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import { Box, Button, Grid, LinearProgress, Rating } from "@mui/material";
import ProductReviewsCard from "./ProductReviewsCard";
import ProductRatingCard from "./ProductRatingCard";
import ProductReviewsSection from "./ProductRatingCard";
import { mens_kurta } from "../../Data/Men/men_kurta";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductsByCategories, findProductsById } from "../../../State/Product/Action";
import { store } from "../../../State/store";
import { addItemToCart } from "../../../State/Cart/Action";
import { toast } from "react-toastify";
import Loading from "../Loading/loading";

const product = {
  name: "Basic Tee 6-Pack",
  price: "$192",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const navigation = useNavigate();

  const dispatch = useDispatch();
  const param = useParams();
  console.log("id        " + param.productId);

  const { products } = useSelector((store) => store);

  useEffect(() => {
    const data = {
      productId: param.productId,
    };
    dispatch(findProductsById(data));
  }, [param.productId]);

  const [selectedSize, setSelectedSize] = useState(product.sizes[0].name);

  useEffect(() => {
    console.log("Selected size:", selectedSize);
  }, [selectedSize]);

  function getDiscountPercent(originalPrice, discountedPrice) {
    if (!originalPrice || originalPrice === 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }

  console.log("product IDDD", param.productId);

  const jwt = localStorage.getItem("jwt");

  const handleAddToCart =async () => {

    if (!jwt) {
      toast("Please login to add items to cart");
      
      return;
    }
      console.log("Jwt token:", jwt);

    const data = {
      productId: param.productId,
      size: selectedSize,
      quantity: 1,
      price: products.product?.price,
    };
    
    await dispatch(addItemToCart(data));

   setTimeout(() => {
        navigation(`/cart`);
    }, 500);
  };


  useEffect(() => {

      
       const data=[
            {
              categoryTitle:"Selected Category",
              categoryName:products.product?.category?.name
            }
       ]
   
   dispatch(findProductsByCategories(data));

  },[dispatch, products.product?.category?.name]);

  const averageRating =
    products.product?.reviews?.length === 0
      ? 0
      : (
          products.product?.reviews?.reduce((sum, r) => sum + r.rating, 0) /
          products.product?.reviews?.length
        ).toFixed(1);

  return (
    <div className="bg-white lg:px-20">

       {products.loading?
                        
                      <div   className="lg:col-span-4 w-full flex justify-center items-center h-screen">
      
                  <Loading/>
                  </div>
       
      :

      <div className="pt-6">
      

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
              <img
                alt={products.product?.imageUrl}
                src={products.product?.imageUrl}
                className="hidden size-full rounded-lg object-cover lg:block"
              />
            </div>
            {/* <div className="flex flex-wrap space-x-5 justify-center">
              {product.images.map((image) => (
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-4">
                  <img
                    alt={image.alt}
                    src={image.src}
                    className="h-full w-full object-center object-cover"
                  />
                </div>
              ))}
            </div> */}
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24 text-left ">
            <div className="lg:col-span-2">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 text-left ">
                {products.product?.brand}
              </h1>
              <h1 className="text-lg lg:text-xl text-gray-900 pt-1">
                {products.product?.title}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900">
                <p className="font-semibold">
                  ₹{products.product?.discountPrice}
                </p>
                <p className="opacity-50 line-through">
                  ₹{products.product?.price}
                </p>
                <p className="text-green-600 font-semibold">
                  {getDiscountPercent(
                    products.product?.price,
                    products.product?.discountPrice
                  )}
                  %off{" "}
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <Rating
                    value={Number(averageRating)}
                    readOnly
                    precision={0.1}
                  />

                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {products?.product?.reviews?.length} Reviews
                  </p>
                </div>
              </div>
              <form className="mt-10">
                {/* Sizes */}
                <div className="mt-10 mb-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {products?.product?.sizes?.map((size) => (
                        <Radio
                          key={size.name}
                          value={size.name}
                          disabled={false}
                          className={classNames(
                            selectedSize === size.name
                              ? "cursor-pointer bg-indigo-100 text-indigo-900 shadow-md" // when selected
                              : "cursor-pointer bg-white text-gray-900 shadow-xs",
                            "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6"
                          )}
                        >
                          <span>{size.name}</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              "pointer-events-none absolute -inset-px rounded-md border-2",
                              selectedSize === size.name
                                ? "border-indigo-500"
                                : "border-transparent group-hover:border-gray-300"
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  sx={{ px: "2rem", py: "1rem", bgcolor: "#9155fd " }}
                >
                  Add To Cart
                </Button>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {products.product?.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                {/* <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3> */}

                {/* <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{product.details}</p>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* rating and Reviews */}
        <section>
          <h1 className="font-semibold text-lg pb-4">Recent Review & Rating</h1>
          <div className="border p-5 max-w-6xl mx-auto">
            <Grid container spacing={3}>
             { products?.product?.reviews?.length > 0 &&
              <Grid item xs={12} md={8}>
                <div className="space-y-5">
                  {products?.product?.reviews.map((item, i) => (
                    <ProductReviewsCard key={i} item={item} />
                  ))}
                </div>
              </Grid>
}
              <Grid item xs={12} md={4}>
                <ProductRatingCard item={products.product?.reviews} />
              </Grid>
            </Grid>
          </div>
        </section>
        {/* Similar Product    */}
        <section className="mt-10">
          <h1 className="py-5 text-xl  text-left font-bold">Similar Product</h1>
          <div className="flex flex-wrap  ">
            {products?.productsByCategories[0]?.products?.map((item) => (
              <div className="py-5">
                {" "}
                <HomeSectionCard product={item} />{" "}
              </div>
            ))}
          </div>
        </section>
      </div> }
    </div>
  );
}
