package com.cesar.kaiju.service;

import com.cesar.kaiju.dto.ProductRequestDTO;
import com.cesar.kaiju.dto.ProductResponseDTO;
import com.cesar.kaiju.dto.ProductReviewRequestDTO;
import com.cesar.kaiju.dto.ProductReviewResponseDTO;
import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;
import com.cesar.kaiju.model.Product;
import com.cesar.kaiju.model.ProductReview;
import com.cesar.kaiju.model.User;
import com.cesar.kaiju.repository.ProductRepository;
import com.cesar.kaiju.repository.ProductReviewRepository;
import com.cesar.kaiju.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductReviewRepository productReviewRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository, ProductReviewRepository productReviewRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productReviewRepository = productReviewRepository;
    }

    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        User currentUser = getCurrentUser();
        
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCategory(request.category());
        product.setStatus(request.status());
        product.setImages(request.images());
        product.setStockQuantity(request.stockQuantity());
        product.setSeller(currentUser);
        product.setBrand(request.brand());
        product.setManufacturer(request.manufacturer());
        product.setTags(request.tags());
        
        Product savedProduct = productRepository.save(product);
        return toResponseDTO(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return toResponseDTO(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(ProductStatus status, ProductCategory category, Pageable pageable) {
        Page<Product> products;
        
        if (status != null && category != null) {
            products = productRepository.findByCategoryAndStatus(category, status, pageable);
        } else if (status != null) {
            products = productRepository.findByStatus(status, pageable);
        } else if (category != null) {
            products = productRepository.findByCategory(category, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }
        
        return products.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(keyword, ProductStatus.ACTIVE, pageable);
        return products.map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getTopRatedProducts(ProductCategory category, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products;
        
        if (category != null) {
            products = productRepository.findTopRatedByCategory(category, pageable);
        } else {
            products = productRepository.findAll(pageable).getContent()
                    .stream()
                    .sorted((p1, p2) -> Double.compare(p2.getRating(), p1.getRating()))
                    .collect(Collectors.toList());
        }
        
        return products.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getLatestProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findLatestProducts(pageable);
        return products.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getProductsBySeller(UUID sellerId, Pageable pageable) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found with id: " + sellerId));
        Page<Product> products = productRepository.findBySeller(seller, pageable);
        return products.map(this::toResponseDTO);
    }

    public ProductResponseDTO updateProduct(UUID id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!product.getSeller().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only update your own products");
        }
        
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCategory(request.category());
        product.setStatus(request.status());
        product.setImages(request.images());
        product.setStockQuantity(request.stockQuantity());
        product.setBrand(request.brand());
        product.setManufacturer(request.manufacturer());
        product.setTags(request.tags());
        
        Product updatedProduct = productRepository.save(product);
        return toResponseDTO(updatedProduct);
    }

    public void updateProductStatus(UUID id, ProductStatus status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        product.setStatus(status);
        productRepository.save(product);
    }

    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        
        User currentUser = getCurrentUser();
        if (!product.getSeller().getUserId().equals(currentUser.getUserId())) {
            throw new SecurityException("You can only delete your own products");
        }
        
        productRepository.delete(product);
    }

    private ProductResponseDTO toResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getStatus(),
                product.getImages(),
                product.getStockQuantity(),
                product.getSeller().getUserId(),
                product.getSeller().getName(),
                product.getBrand(),
                product.getManufacturer(),
                product.getTags(),
                product.getRating(),
                product.getReviewCount(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    @Transactional(readOnly = true)
    public Page<ProductReviewResponseDTO> getProductReviews(UUID productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        
        Page<ProductReview> reviews = productReviewRepository.findByProduct(product, pageable);
        return reviews.map(this::toReviewResponseDTO);
    }

    public ProductReviewResponseDTO createProductReview(UUID productId, ProductReviewRequestDTO request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        
        User currentUser = getCurrentUser();
        
        // Check if user already reviewed this product
        boolean alreadyReviewed = productReviewRepository.findByProduct_ProductId(productId, Pageable.unpaged())
                .getContent()
                .stream()
                .anyMatch(review -> review.getUser().getUserId().equals(currentUser.getUserId()));
        
        if (alreadyReviewed) {
            throw new IllegalStateException("You have already reviewed this product");
        }
        
        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(currentUser);
        review.setRating(request.rating());
        review.setComment(request.comment());
        
        ProductReview savedReview = productReviewRepository.save(review);
        
        // Update product rating and review count
        updateProductRating(product);
        
        return toReviewResponseDTO(savedReview);
    }

    public void markReviewHelpful(UUID productId, Long reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));
        
        if (!review.getProduct().getProductId().equals(productId)) {
            throw new IllegalArgumentException("Review does not belong to this product");
        }
        
        review.setHelpful(review.getHelpful() + 1);
        productReviewRepository.save(review);
    }

    private void updateProductRating(Product product) {
        var allReviews = productReviewRepository.findByProduct(product, Pageable.unpaged());
        
        if (allReviews.isEmpty()) {
            product.setRating(0.0);
            product.setReviewCount(0);
        } else {
            double averageRating = allReviews.getContent().stream()
                    .mapToInt(ProductReview::getRating)
                    .average()
                    .orElse(0.0);
            
            product.setRating(averageRating);
            product.setReviewCount(allReviews.getContent().size());
        }
        
        productRepository.save(product);
    }

    private ProductReviewResponseDTO toReviewResponseDTO(ProductReview review) {
        return new ProductReviewResponseDTO(
                review.getId(),
                review.getProduct().getProductId(),
                review.getUser().getUserId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getHelpful(),
                review.getCreatedAt()
        );
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
