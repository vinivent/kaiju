package com.cesar.kaiju.repository;

import com.cesar.kaiju.enums.ProductCategory;
import com.cesar.kaiju.enums.ProductStatus;
import com.cesar.kaiju.model.Product;
import com.cesar.kaiju.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
    
    Page<Product> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<Product> findBySeller(User seller, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, 
                                  @Param("status") ProductStatus status, 
                                  Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.status = 'ACTIVE' " +
           "ORDER BY p.rating DESC, p.reviewCount DESC")
    List<Product> findTopRatedByCategory(@Param("category") ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts(Pageable pageable);
    
    @Modifying
    @Query("DELETE FROM Product p WHERE p.seller = :seller")
    void deleteBySeller(@Param("seller") User seller);
}
