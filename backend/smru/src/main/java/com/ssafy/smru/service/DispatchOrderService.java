package com.ssafy.smru.service;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.DispatchOrderListDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.Optional;
public interface DispatchOrderService {

    public Page<DispatchOrderListDto.Response> getFilteredDispatchOrders(String createdBy, Timestamp startDate, Timestamp endDate, Pageable pageable);
    public DispatchOrderDto.Response getDispatchOrderById(Long dispatchOrderId);
    public void deleteDispatchOrderById (Long dispatchOrderId);
    public DispatchOrder createFirstOrder(FirstDispatchOrderDto.FirstInfoRequest request);
    public DispatchOrder updateSecondOrder(SecondDispatchOrderDto.Request request);


}
