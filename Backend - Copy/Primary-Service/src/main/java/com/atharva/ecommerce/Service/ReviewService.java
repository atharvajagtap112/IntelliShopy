package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Model.Review;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Request.ReviewRequest;

import java.util.List;

public interface ReviewService {
   public Review createReview(ReviewRequest req, User user) throws ProductException;
   public List<Review> getAllReviews(Long productId);
}
