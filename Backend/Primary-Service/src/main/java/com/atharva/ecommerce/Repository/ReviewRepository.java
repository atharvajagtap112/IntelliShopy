package com.atharva.ecommerce.Repository;

import com.atharva.ecommerce.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {

    @Query("SELECT r from Review r WHERE r.product.id=:productId")
    public List<Review> getAllProductsReview (@Param("productId") Long productId);
}
