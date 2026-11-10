package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.Exception.ProductException;
import com.atharva.ecommerce.Model.Product;
import com.atharva.ecommerce.Repository.ProductRepository;
import com.atharva.ecommerce.Request.ProductCategoryRequest;
import com.atharva.ecommerce.Response.ProductsByCategoryResponse;
import com.atharva.ecommerce.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import com.atharva.ecommerce.Service.ClipSearchServics;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")



public class ProductController {
    @Autowired
     private ProductService productService;

   @Autowired
   private ProductRepository productRepository;

   
   
   @Autowired
   private ClipSearchServics clipSearchServics;


    @PostMapping("/search/image")
    public List<Product> searchByImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam(required = false) String color
    ) throws Exception {

        List<Product> products = inRankedOrder(clipSearchServics.search(image));

        if (color != null) {
            products = products.stream()
                    .filter(p -> p.getColor().equalsIgnoreCase(color))
                    .toList();
        }

        return products;
    }

    // Semantic search: matches the text against product *images* via CLIP, so
    // "floral summer dress" works even though no product field says "summer".
    @GetMapping("/search/text")
    public List<Product> searchByText(@RequestParam("q") String query) {
        return inRankedOrder(clipSearchServics.searchByText(query));
    }

    // CLIP returns ids ranked by similarity, but findAllById answers in
    // whatever order the DB feels like - so the closest match was landing
    // anywhere on the page. Re-sort into the ranked order it came back in.
    private List<Product> inRankedOrder(List<Long> productIds) {
        Map<Long, Product> byId = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        return productIds.stream()
                .map(byId::get)
                .filter(Objects::nonNull)   // id no longer in the catalogue
                .collect(Collectors.toList());
    }

    @GetMapping()
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(
            @RequestParam String category,
            @RequestParam List<String> color,
            @RequestParam List<String> size,
            @RequestParam Integer minPrice,
            @RequestParam Integer maxPrice,
            @RequestParam Integer minDiscount,
            @RequestParam String sort,
            @RequestParam String stock,
            @RequestParam Integer pageNumber,
            @RequestParam Integer pageSize) {

        Page<Product> res = productService.getAllProduct(
                category, color, size, minPrice, maxPrice,
                minDiscount, sort, stock, pageNumber, pageSize
        );

        System.out.println("complete products");
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException {
        Product product =productService.findProductById(productId);

        return new ResponseEntity<Product>(product, HttpStatus.ACCEPTED);
    }

//    @GetMapping("/products/search")
//    public ResponseEntity<List<Product>> searchProductHandler(@RequestParam String q) {
//        List<Product> products = productService.searchProduct(q);
//        return new ResponseEntity<>(products, HttpStatus.OK);
//    }


    @PostMapping("/bycategories")
    public ResponseEntity<List<ProductsByCategoryResponse>> getProductsByCategoryHandler(@RequestBody List<ProductCategoryRequest> categories) throws ProductException {

        List<ProductsByCategoryResponse> data = productService.getProductsByCategoriesLogic(categories);
        return ResponseEntity.ok(data);
    }




    @PostMapping("delete/bycategories")
    public ResponseEntity<String> getProductsByCategoryHandler(@RequestParam String category) throws ProductException {


            List<Product> products= productService.findProductsByCategory(category);


                   productRepository.deleteAll(products);



        return new ResponseEntity<String>("deleted succesfully", HttpStatus.ACCEPTED);
    }

}
