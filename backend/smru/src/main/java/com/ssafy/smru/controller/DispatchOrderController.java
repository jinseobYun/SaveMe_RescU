package com.ssafy.smru.controller;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.DispatchOrderListDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.service.DispatchOrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;

@RestController
@RequestMapping("/api/v1/web/dispatch-orders")
@RequiredArgsConstructor
public class DispatchOrderController {

    private final DispatchOrderServiceImpl dispatchOrderService;

    // 출동 지령 리스트 + 작성자, 기간에 따른 필터링 기능
    @GetMapping
    public ResponseEntity<Page<DispatchOrderListDto.Response>> getDispatchOrders(
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<DispatchOrderListDto.Response> dispatchOrders = dispatchOrderService.getFilteredDispatchOrders(createdBy, startDate, endDate, pageable);
        return new ResponseEntity<>(dispatchOrders, HttpStatus.OK);
    }

    // 출동 지령 상세 조회
    @GetMapping("/{dispatchOrderId}")
    public ResponseEntity<DispatchOrderDto.Response> getDispatchOrderById(@PathVariable Long dispatchOrderId) {
        DispatchOrderDto.Response dispatchOrder = dispatchOrderService.getDispatchOrderById(dispatchOrderId);
        return new ResponseEntity<>(dispatchOrder, HttpStatus.OK);
    }

    // 출동 지령 삭제
    @DeleteMapping("/{dispatchOrderId}")
    public ResponseEntity<Void> deleteDispatchOrderById(@PathVariable Long dispatchOrderId) {
        dispatchOrderService.deleteDispatchOrderById(dispatchOrderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 1차 출동지령정보 작성
    @PostMapping("/1st-info")
    public ResponseEntity<FirstDispatchOrderDto.Response> createFirstOrder(@RequestBody FirstDispatchOrderDto.FirstInfoRequest dto) {
        DispatchOrder dispatchOrder = dispatchOrderService.createFirstOrder(dto);
        return ResponseEntity.ok(new FirstDispatchOrderDto.Response(dispatchOrder.getDispatchOrderId()));
    }

    // 2차 출동지령정보 업데이트
    @PutMapping("/2nd-info")
    public ResponseEntity<?> updateSecondOrder(@RequestBody SecondDispatchOrderDto.Request request) {
        DispatchOrder dispatchOrder = dispatchOrderService.updateSecondOrder(request);
        return ResponseEntity.ok().body("2차 출동지령정보가 성공적으로 업데이트되었습니다.");
    }

}
