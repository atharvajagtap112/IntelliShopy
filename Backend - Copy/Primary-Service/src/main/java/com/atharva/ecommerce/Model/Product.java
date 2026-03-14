package com.atharva.ecommerce.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private double price;

    private String description;

    private int discountPresent;

    private int discountPrice;

    private String brand;

    private int quantity;

   private String color;


   @ElementCollection
   private Set<Size> sizes=new HashSet<>();

   @Column(name = "image_url")
   private String imageUrl;

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Rating> rating=new ArrayList<>();

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Review> reviews=new ArrayList<>();

   @Column(name = "num_rating")
   private int numRating;

   @ManyToOne()
   @JoinColumn(name = "category_id")
   private Category category;

   private LocalDateTime createdAt;

   public Product() {}

    public Product(Long id, String title, double price, String description, int discountPresent, int discountPrice, String brand, int quantity, String color, Set<Size> sizes, String imageUrl, List<Rating> rating, List<Review> reviews, int numRating, Category category, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.discountPresent = discountPresent;
        this.discountPrice = discountPrice;
        this.brand = brand;
        this.quantity = quantity;
        this.color = color;
        this.sizes = sizes;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.reviews = reviews;
        this.numRating = numRating;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDiscountPresent() {
        return discountPresent;
    }

    public void setDiscountPresent(int discountPresent) {
        this.discountPresent = discountPresent;
    }

    public int getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(int discountPrice) {
        this.discountPrice = discountPrice;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<Size> getSizes() {
        return sizes;
    }

    public void setSizes(Set<Size> sizes) {
        this.sizes = sizes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<Rating> getRating() {
        return rating;
    }

    public void setRating(List<Rating> rating) {
        this.rating = rating;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public int getNumRating() {
        return numRating;
    }

    public void setNumRating(int numRating) {
        this.numRating = numRating;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
