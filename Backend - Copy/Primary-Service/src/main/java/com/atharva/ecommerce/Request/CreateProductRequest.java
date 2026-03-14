package com.atharva.ecommerce.Request;

import com.atharva.ecommerce.Model.Size;

import java.util.Set;

public class CreateProductRequest {


    private String title;

    private double price;

    private String description;

    private int discountPresent;

    private int discountedPrice;

    private String brand;

    private int quantity;

    private String color;

    private Set<Size> sizes;

    private String imageUrl;

    private String topLevelCategory;
    private String secLevelCategory;
    private String thirdLevelCategory;

    public CreateProductRequest() {}

    public CreateProductRequest(String title, double price, String description, int discountPresent, int discountedPrice){
        this.title = title;
        this.price = price;
        this.description = description;
        this.discountPresent = discountPresent;
        this.discountedPrice = discountedPrice;

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

    public int getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(int discountedPrice) {
        this.discountedPrice = discountedPrice;
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

    public String getTopLevelCategory() {
        return topLevelCategory;
    }

    public void setTopLevelCategory(String topLevelCategory) {
        this.topLevelCategory = topLevelCategory;
    }

    public String getSecLevelCategory() {
        return secLevelCategory;
    }

    public void setSecLevelCategory(String secLevelCategory) {
        this.secLevelCategory = secLevelCategory;
    }

    public String getThirdLevelCategory() {
        return thirdLevelCategory;
    }

    public void setThirdLevelCategory(String thirdLevelCategory) {
        this.thirdLevelCategory = thirdLevelCategory;
    }
}
