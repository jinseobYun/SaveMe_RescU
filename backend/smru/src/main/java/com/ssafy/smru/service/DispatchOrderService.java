package com.ssafy.smru.service;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;

public interface DispatchOrderService {

    // 아직 impl에 extends 안함 ㅎ;

    public DispatchOrderDto.Response getDispatchOrder(Long orderId);
    public DispatchOrder saveDispatchOrder (DispatchOrderDto.Request dto, String memberId);
    public FirstDispatchOrderDto.Response createDispatchOrder(FirstDispatchOrderDto.FirstInfoRequest dto);

    public int createDispatchOrder2(SecondDispatchOrderDto.Request dto);
}
