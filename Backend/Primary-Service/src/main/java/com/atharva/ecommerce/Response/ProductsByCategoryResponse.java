package com.atharva.ecommerce.Response;

import com.atharva.ecommerce.Model.Product;

import java.io.Serializable;
import java.util.List;

public class ProductsByCategoryResponse  implements Serializable {
    String categoryName;
    List<Product> products;

   public ProductsByCategoryResponse(){

    }

   public ProductsByCategoryResponse(String categoryName, List<Product> products) {
        this.categoryName = categoryName;
        this.products = products;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
