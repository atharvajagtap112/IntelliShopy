package com.atharva.ecommerce.Response;

public class PaymentLinkResponse {
    private String payment_link_Id;
    private String payment_link_url;

    public PaymentLinkResponse(){

    }

    public PaymentLinkResponse(String payment_link_Id, String payment_link_url) {
        this.payment_link_Id = payment_link_Id;
        this.payment_link_url = payment_link_url;
    }

    public String getPayment_link_Id() {
        return payment_link_Id;
    }

    public void setPayment_link_Id(String payment_link_Id) {
        this.payment_link_Id = payment_link_Id;
    }

    public String getPayment_link_url() {
        return payment_link_url;
    }

    public void setPayment_link_url(String payment_link_url) {
        this.payment_link_url = payment_link_url;
    }
}
