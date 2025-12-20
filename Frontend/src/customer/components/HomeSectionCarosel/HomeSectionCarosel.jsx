import React, { useState } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Button from "@mui/material/Button";
import { mens_kurta } from "../../Data/Men/men_kurta";

const HomeSectionCarosel = ({data,sectionName}) => {
  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1024: { items: 5.5 },
  };

  const [activeIndex,setActiveIndex] =useState(0);

  const syncActiveIndex=({index})=>setActiveIndex(index);

  const slidePrev = ()=>setActiveIndex(activeIndex-1);
  const slidNext = ()=>{
    console.log(activeIndex)
    setActiveIndex(activeIndex+1)}

  const items = data?.slice(0,10).map((item) => ( <HomeSectionCard product={item}  /> ));
  return (
    <div className="border">
      <h2 className="text-2xl font-extrabold text-left text-gray-800">
      {sectionName}</h2>
      <div className="relative p-5">
        <AliceCarousel
     
          items={items}
          disableButtonsControls
          
          responsive={responsive}
          disableDotsControls
          onSlideChange={syncActiveIndex}
          activeIndex={activeIndex}
        />

        {activeIndex !== items?.length-5 && 
          <Button
            onClick={slidNext}
            variant="contained"
            className="z-50"
            sx={{
              position: "absolute",
              top: "8rem",
              right: "0rem",
              transform: "translateX(50%) rotate(90deg)",
              bgcolor: "white",
            }}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon
              sx={{ transform: "rotate(90deg)", color: "black" }}
            />
          </Button>
        }
        {activeIndex !== 0 &&
        <Button
          onClick={slidePrev}
          variant="contained"
          className="z-50"
          sx={{
            position: "absolute",
            top: "8rem",
            left: "0rem",
            transform: "translateX(-50%) rotate(90deg)",
            bgcolor: "white",
          }}
          aria-label="prev"
        >
          <KeyboardArrowLeftIcon
            sx={{ transform: "rotate(-90deg)", color: "black" }}
          />
        </Button>}
      </div>
    </div>
  );
};

export default HomeSectionCarosel;
