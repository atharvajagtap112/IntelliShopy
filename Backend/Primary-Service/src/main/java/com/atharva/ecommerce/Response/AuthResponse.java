package com.atharva.ecommerce.Response;

public class AuthResponse {

    private String  jwt;
    private String  message;
    private String  refreshToken;

    public AuthResponse() {}

    public AuthResponse(String jwt, String message) {
       super();
     this.jwt = jwt;
     this.message = message;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
