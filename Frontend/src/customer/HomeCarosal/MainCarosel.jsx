import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCaroselData';

const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};



const MainCarousel = () => {
    const items = mainCarouselData.map((item) => (
  <div className="flex h-100 justify-center">
    <img
      className="w-full h-50 cursor-pointer object-cover object-center"
      role="presentation"
      alt=""
      src={item.image}
    />
  </div>
));
   return ( 
   <AliceCarousel
        mouseTracking
        items={items}      
          
        autoPlay
        disableButtonsControls
        autoPlayInterval={1000}
        infinite       
/>
);
}
export default MainCarousel;