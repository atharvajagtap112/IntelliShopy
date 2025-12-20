package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Model.Product;
import com.atharva.ecommerce.Model.Rating;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Repository.ProductRepository;
import com.atharva.ecommerce.Repository.RatingRepository;
import com.atharva.ecommerce.Repository.UserRepository;
import com.atharva.ecommerce.Request.RatingRequest;
import org.springframework.stereotype.Service;

import javax.xml.crypto.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RatingServiceImplementation implements RatingService {
    private ProductService productService;

    private RatingRepository ratingRepository;

    public RatingServiceImplementation(ProductService productService, RatingRepository ratingRepository) {
        this.productService = productService;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public Rating createRating(RatingRequest req, User user) throws ProductException {

        Product product=productService.findProductById(req.getProductId());

            Rating rating = new Rating();
            rating.setRating(req.getRating());
            rating.setUser(user);
            rating.setProduct(product);
            rating.setCreatedAt(LocalDateTime.now());

           return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getProductsRatings(Long productId) throws ProductException {
        return ratingRepository.getAllProductsRating(productId);
    }
}
