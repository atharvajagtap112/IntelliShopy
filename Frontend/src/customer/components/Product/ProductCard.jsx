import React from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";

// The listing/search grids and the homepage rails render the same product card.
// Keeping this as a thin alias means the card is designed once, not twice.
export const ProductCard = ({ product, index = 0 }) => (
  <HomeSectionCard product={product} index={index} />
);

export default ProductCard;
