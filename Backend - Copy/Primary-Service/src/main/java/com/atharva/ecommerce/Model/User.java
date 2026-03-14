package com.atharva.ecommerce.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String mobile;

    private String role;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) //CascadeType.ALL means when we delete the user all address should also delete
    private List<Address> address;


     @ElementCollection // Tells JPA: “Make a new table for this list.”
     //used when we do not want to create an entity
     //like it will not have id , primary key etc
     //just used to store an extra list type info in db and ElementCollection automatically
     // creates an table and give name and link to main table in our case it is
     // user by gussing user what will be id of user table as an foregn key like User_Id user_id etc
     @CollectionTable(name = "payment_information", joinColumns = @JoinColumn(name = "user_id"))
     //Tells JPA: “Here’s how the table should look and connect.”
     //CollectionTable by using this we can add name and tell jpa now to link to main user table
     private List<PaymentInformation> paymentInformationList;

     @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
     @JsonIgnore //to avoid nested issue
     private List<Rating> ratings;

     @OneToMany(mappedBy = "user")
     @JsonIgnore
     private List<Review> reviews;


     private LocalDateTime createdAt;

     public User(){

     }

    public User(Long id, String firstName, String lastName, String email, String password, String mobile, String role, List<Address> address, List<PaymentInformation> paymentInformationList, List<Rating> ratings, List<Review> reviews, LocalDateTime createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.role = role;
        this.address = address;
        this.paymentInformationList = paymentInformationList;
        this.ratings = ratings;
        this.reviews = reviews;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }

    public List<PaymentInformation> getPaymentInformationList() {
        return paymentInformationList;
    }

    public void setPaymentInformationList(List<PaymentInformation> paymentInformationList) {
        this.paymentInformationList = paymentInformationList;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", mobile='" + mobile + '\'' +
                ", role='" + role + '\'' +
                ", address=" + address +
                ", paymentInformationList=" + paymentInformationList +
                ", ratings=" + ratings +
                ", reviews=" + reviews +
                ", createdAt=" + createdAt +
                '}';
    }
}
