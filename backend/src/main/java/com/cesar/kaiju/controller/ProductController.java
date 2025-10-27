package com.cesar.kaiju.controller;

import com.cesar.kaiju.dto.ProductRequestDTO;
import com.cesar.kaiju.dto.ProductResponseDTO;
import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;
import com.cesar.kaiju.model.Product;
import com.cesar.kaiju.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductResponseDTO>> getTopRated(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductResponseDTO> products = productService.getTopRatedProducts(category, limit);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ProductResponseDTO>> getLatest(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductResponseDTO> products = productService.getLatestProducts(limit);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsBySeller(
            @PathVariable UUID sellerId,
            Pageable pageable) {
        Page<ProductResponseDTO> products = productService.getProductsBySeller(sellerId, pageable);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequestDTO request) {
        ProductResponseDTO product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateProductStatus(
            @PathVariable UUID id,
            @RequestParam ProductStatus status) {
        productService.updateProductStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
