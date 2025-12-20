package com.atharva.ecommerce.Model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Size {
    private String name;
    private int quantity;
    private int stock;

    public Size(){}

    public Size(String name, int quantity, int stock) {
        this.name = name;
        this.quantity = quantity;
        this.stock = stock;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}
