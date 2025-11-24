package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.ProductRequestDTO;
import com.cesar.kaiju.dto.ProductResponseDTO;
import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;
import com.cesar.kaiju.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO request) {
        ProductResponseDTO product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable UUID id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(required = false) ProductCategory category,
            Pageable pageable) {
        Page<ProductResponseDTO> products = productService.getAllProducts(status, category, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponseDTO>> searchProducts(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<ProductResponseDTO> products = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(products);
    }

}
