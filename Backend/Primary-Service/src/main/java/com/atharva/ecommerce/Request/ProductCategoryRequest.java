package com.atharva.ecommerce.Request;

import java.io.Serializable;

public class ProductCategoryRequest implements Serializable {
    String categoryTitle;
    String categoryName;

    public ProductCategoryRequest() {

    }

    public ProductCategoryRequest(String categoryTitle, String categoryName) {
        this.categoryTitle = categoryTitle;
        this.categoryName = categoryName;
    }

    public String getCategoryTitle() {
        return categoryTitle;
    }

    @Override
    public String toString() {
        return "ProductCategoryRequest{" +
                "categoryTitle='" + categoryTitle + '\'' +
                ", categoryName='" + categoryName + '\'' +
                '}';
    }

    public void setCategoryTitle(String categoryTitle) {
        this.categoryTitle = categoryTitle;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
