package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Model.Rating;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Request.RatingRequest;

import java.util.List;

public interface RatingService {
    public Rating createRating(RatingRequest req, User user)throws ProductException;
    public List<Rating> getProductsRatings(Long productId)throws ProductException;
}
