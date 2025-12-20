package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Model.Product;
import com.atharva.ecommerce.Model.Review;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.ProductRepository;
import com.atharva.ecommerce.Repository.ReviewRepository;
import com.atharva.ecommerce.Request.ReviewRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImplementation implements ReviewService {

    private ReviewRepository reviewRepository;
    private ProductService productService;
    private ProductRepository productRepository;

    public ReviewServiceImplementation(ReviewRepository reviewRepository, ProductService productService, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.productRepository = productRepository;
    }

    @Override
    public Review createReview(ReviewRequest req, User user) throws ProductException {
        Product product=productService.findProductById(req.getProductId());
       Review review = new Review();
       review.setReview(req.getReview());
       review.setUser(user);
       review.setProduct(product);
       review.setRating(req.getRating());
       review.setCreatedAt(LocalDateTime.now());
      return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReviews(Long productId) {
        return reviewRepository.getAllProductsReview(productId);
    }
}


