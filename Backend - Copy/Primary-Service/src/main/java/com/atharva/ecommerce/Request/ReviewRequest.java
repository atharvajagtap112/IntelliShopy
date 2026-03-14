package com.atharva.ecommerce.Request;

public class ReviewRequest {
    private Long productId;
    private String review;
    private double  rating;

    public ReviewRequest() {}

    public ReviewRequest(Long productId, String review , double  rating) {
        this.productId = productId;
        this.rating = rating;
        this.review = review;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}
