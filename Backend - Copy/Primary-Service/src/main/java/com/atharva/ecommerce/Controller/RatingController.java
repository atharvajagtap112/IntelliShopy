package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Exception.UserException;
import com.atharva.ecommerce.Model.Rating;
import com.atharva.ecommerce.Model.User;
import com.atharva.ecommerce.Request.RatingRequest;
import com.atharva.ecommerce.Service.RatingService;
import com.atharva.ecommerce.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/rating")
public class RatingController {


    @Autowired
    private UserService userService;

    @Autowired
    private RatingService ratingService;

    @PostMapping("/create")
    public ResponseEntity<Rating> createRating(
            @RequestBody RatingRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        Rating rating = ratingService.createRating(req, user);

        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Rating>> getProductsRating(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        List<Rating> ratings = ratingService.getProductsRatings(productId);

        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }
}
