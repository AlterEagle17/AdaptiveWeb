package com.adaptiveweb.adaptiveweb.service;

import com.adaptiveweb.adaptiveweb.dto.OrderRequest;
import com.adaptiveweb.adaptiveweb.entity.Order;
import com.adaptiveweb.adaptiveweb.entity.OrderItem;
import com.adaptiveweb.adaptiveweb.repository.OrderRepository;
import com.adaptiveweb.adaptiveweb.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : "Guest Customer");
        order.setCustomerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail() : "guest@adaptiveweb.io");

        BigDecimal total = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setProductId(itemDto.getProductId());
                item.setQuantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 1);

                BigDecimal unitPrice = itemDto.getUnitPrice();
                String productName = "Product #" + itemDto.getProductId();

                if (itemDto.getProductId() != null) {
                    productRepository.findById(itemDto.getProductId()).ifPresent(p -> {
                        item.setProductName(p.getName());
                    });
                }
                if (item.getProductName() == null) {
                    item.setProductName(productName);
                }

                if (unitPrice == null) {
                    unitPrice = BigDecimal.valueOf(9999);
                }
                item.setUnitPrice(unitPrice);

                BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(itemTotal);

                order.addItem(item);
            }
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
