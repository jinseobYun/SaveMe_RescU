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

import java.sql.Timestamp;

@RestController
@RequestMapping("/api/v1/web/dispatch-orders")
@RequiredArgsConstructor
public class DispatchOrderController {

    private final DispatchOrderServiceImpl dispatchOrderServiceImpl;

    // 출동 지령 등록
    @PostMapping
    public ResponseEntity<DispatchOrder> createDispatchOrder(@RequestBody DispatchOrderDto.Request dto) {
        DispatchOrder createdOrder = dispatchOrderServiceImpl.createDispatchOrder(dto);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    // 출동 지령 리스트 + 작성자, 기간에 따른 필터링 기능
    @GetMapping
    public ResponseEntity<Page<DispatchOrderListDto.Response>> getDispatchOrders(
            @RequestParam(required = false) String createdBy,
            @RequestParam(required = false) Timestamp startDate,
            @RequestParam(required = false) Timestamp endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<DispatchOrderListDto.Response> dispatchOrders = dispatchOrderServiceImpl.getFilteredDispatchOrders(createdBy, startDate, endDate, pageable);
        return new ResponseEntity<>(dispatchOrders, HttpStatus.OK);

    }
    // 출동 지령 상세 조회
    @GetMapping("/{dispatchOrderId}")
    public ResponseEntity<DispatchOrderDto.Response> getDispatchOrderById(@PathVariable Long dispatchOrderId) {
        DispatchOrderDto.Response dispatchOrder = dispatchOrderServiceImpl.getDispatchOrderById(dispatchOrderId);
        return new ResponseEntity<>(dispatchOrder, HttpStatus.OK);
    }
    // 출동 지령 삭제
    @DeleteMapping("/{dispatchOrderId}")
    public ResponseEntity<Void> deleteDispatchOrderById(@PathVariable Long dispatchOrderId) {
        dispatchOrderServiceImpl.deleteDispatchOrderById(dispatchOrderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 성공적으로 삭제된 경우 204 No Content 상태를 반환
    }


//    @PostMapping("/1st-info")
//    public ResponseEntity<?> firstReportReceived(@RequestBody FirstDispatchOrderDto.FirstInfoRequest dto) {
//
//            FirstDispatchOrderDto.Response response = dispatchOrderServiceImpl.createDispatchOrder(dto);
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//    }

//    @PostMapping("/2nd-info")
//    public ResponseEntity<?> secondReportReceived(@RequestBody SecondDispatchOrderDto.Request dto) {
//        return ResponseEntity.ok(dispatchOrderServiceImpl.createDispatchOrder2(dto));
//    }
}
