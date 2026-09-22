package com.adaptiveweb.adaptiveweb.service;

import com.adaptiveweb.adaptiveweb.entity.Product;
import com.adaptiveweb.adaptiveweb.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts(String category, Integer limit) {
        List<Product> products;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
            products = productRepository.findByCategoryIgnoreCase(category);
        } else {
            products = productRepository.findAll();
        }

        if (limit != null && limit > 0 && limit < products.size()) {
            return products.subList(0, limit);
        }
        return products;
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
