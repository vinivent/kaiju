package com.cesar.kaiju.repository;

import com.cesar.kaiju.model.Product;
import com.cesar.kaiju.model.ProductReview;
import com.cesar.kaiju.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    
    Page<ProductReview> findByProduct(Product product, Pageable pageable);
    
    Page<ProductReview> findByProduct_ProductId(UUID productId, Pageable pageable);
    
    @Modifying
    @Query("DELETE FROM ProductReview pr WHERE pr.user = :user")
    void deleteByUser(@Param("user") User user);
}

