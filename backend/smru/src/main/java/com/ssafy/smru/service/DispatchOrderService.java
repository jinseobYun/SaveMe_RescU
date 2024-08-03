package com.ssafy.smru.service;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;

import java.util.Optional;
public interface DispatchOrderService {



    // 새로 여기서 부터
    int DispatchOrder(DispatchOrderDto.Request dispatchOrderDto);

}
