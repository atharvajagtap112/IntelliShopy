package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.DTO.EmailNotificationEvent;
import com.atharva.ecommerce.Exception.OrderException;
import com.atharva.ecommerce.Model.Order;
import com.atharva.ecommerce.Repository.OrderRepository;
import com.atharva.ecommerce.Response.ApiResponse;
import com.atharva.ecommerce.Response.PaymentLinkResponse;
import com.atharva.ecommerce.Service.EmailService;
import com.atharva.ecommerce.Service.KafkaProducerService;
import com.atharva.ecommerce.Service.OrderService;
import com.atharva.ecommerce.Service.UserService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.AccessType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentController {
 @Value("${razorpay.api.key}")
 private String apiKey;

 @Value("${razorpay.api.secret}")
 private String apiSecret;

 @Autowired
 private OrderService orderService;

 @Autowired
 private UserService userService;

 @Autowired
 private OrderRepository orderRepository;


 @Autowired
 private KafkaProducerService kafkaProducerService;


 @Autowired
 private EmailService emailService;

  @PostMapping("/payments/{orderId}")
   public ResponseEntity<PaymentLinkResponse> createPaymentLink(@PathVariable Long orderId,
                                                                @RequestHeader("Authorization") String jwt ) throws OrderException, RazorpayException {
      Order order =orderService.findOrderById(orderId);
      try{
        RazorpayClient razorpayClient =new RazorpayClient(apiKey,apiSecret);

          JSONObject paymentLinkRequest= new JSONObject();

          paymentLinkRequest.put("amount",order.getTotalDiscountedPrice()*100);
          paymentLinkRequest.put("currency","INR");

          JSONObject customer =new JSONObject();
          customer.put("name",order.getUser().getFirstName());
          customer.put("email",order.getUser().getEmail());

          paymentLinkRequest.put("customer",customer);

          JSONObject notify =new JSONObject();
          notify.put("sms",true);
          notify.put("email",true);

          paymentLinkRequest.put("notify",notify);

          paymentLinkRequest.put("callback_url","http://localhost:3000/payment/"+orderId);
           paymentLinkRequest.put("callback_method","get");

          PaymentLink payment= razorpayClient.paymentLink.create(paymentLinkRequest);

          String paymentLinkId=payment.get("id");
          String paymentLinkUrl=payment.get("short_url");

          PaymentLinkResponse res=new PaymentLinkResponse();
          res.setPayment_link_Id(paymentLinkId);
          res.setPayment_link_url(paymentLinkUrl);

          return new ResponseEntity<PaymentLinkResponse>(res, HttpStatus.CREATED);
      }
      catch (Exception e){
         throw new RazorpayException(e.getMessage());
      }
  }

  @GetMapping("/payments")
  public ResponseEntity<ApiResponse> redirect(@RequestParam(name="payment_id") String paymentId,
                                              @RequestParam(name="order_id") Long orderId ) throws RazorpayException, OrderException {
      System.out.println( "------------------------------------------------------------------payment ID"+paymentId+" order ID"+orderId);
       Order order=orderService.findOrderById(orderId);
       RazorpayClient razorpay =new RazorpayClient(apiKey,apiSecret);


       try{

          Payment payment= razorpay.payments.fetch(paymentId);

           System.out.println(payment.toString());

           String status = (String) payment.get("status");

           if ("captured".equals(status)){
              order.getPaymentDetails().setPaymentId(paymentId);
              order.getPaymentDetails().setStatus("COMPLETED");
              order.setOrderStatus("ORDER_CONFIRMED");

//              emailService.sendOrderConfirmationEmail(order);

               EmailNotificationEvent event=new EmailNotificationEvent();
               event.setBody(buildOrderConfirmationEmail(order));
               event.setTo(order.getUser().getEmail());
               event.setSubject("Order Confirmation - Order #" + order.getId());
               event.setEmailType("ORDER_CONFIRMATION");



               kafkaProducerService.sendEmailNotificationEvent(event);

              orderRepository.save(order);
          }
          return new ResponseEntity<ApiResponse>(new ApiResponse("your order get placed",true),HttpStatus.OK);
       }
       catch (Exception e){
    throw new RazorpayException(e.getMessage());
       }

  }

    private String buildOrderConfirmationEmail(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hi ").append(order.getUser().getFirstName()).append(",\n\n");
        sb.append("Thank you for your order ").append(order.getId()).append(".\n");
        sb.append("Total Amount: Rs.").append(order.getTotalDiscountedPrice()).append("\n");
        sb.append("Order Status: ").append(order.getOrderStatus()).append("\n\n");
        sb.append("Your order items:\n");

        order.getOrderItems().forEach(item -> {
            sb.append("- ").append(item.getProduct().getTitle())
                    .append(" x ").append(item.getQuantity())
                    .append(" (Rs.").append(item.getDiscountedPrice()).append(")\n");
        });

        sb.append("\nWe will notify you once your order is shipped.");
        return sb.toString();
    }

}
