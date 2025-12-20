package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.Review;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Request.ReviewRequest;
import com.atharva.ecommerce.Service.ReviewService;
import com.atharva.ecommerce.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/review")
public class ReviewController {

     @Autowired
    private UserService userService;
     @Autowired
    private ReviewService reviewService;

   @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest req,
                                                @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
       User user=userService.findUserProfileByJwt(jwt);
       Review review=  reviewService.createReview(req,user);


   return new ResponseEntity<Review>(review,HttpStatus.CREATED);
   }

   @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductsReview(@PathVariable("productId") Long productId)
           throws UserException, ProductException {
     List<Review> reviews=  reviewService.getAllReviews(productId);
     return new ResponseEntity<>(reviews,HttpStatus.ACCEPTED);
   }


}

