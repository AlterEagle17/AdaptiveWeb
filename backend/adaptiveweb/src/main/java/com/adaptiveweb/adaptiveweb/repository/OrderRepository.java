package com.adaptiveweb.adaptiveweb.repository;

import com.adaptiveweb.adaptiveweb.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmailIgnoreCase(String customerEmail);
}
