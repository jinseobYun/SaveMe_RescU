package com.ssafy.smru.controller;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.service.DispatchOrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/web/dispatch-orders")
@RequiredArgsConstructor
public class DispatchOrderController {
    private final DispatchOrderServiceImpl dispatchOrderServiceImpl;

    // 출동 지령 작성
    @PostMapping
    public ResponseEntity<?> createDispatchOrder(@RequestBody DispatchOrderDto.Request request) {
        try {
            // 현재 로그인된 사용자의 인증정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // 아이디 가져오기
            String memberId = authentication.getName();
            // 출동지령 정보 저장
            DispatchOrder dispatchOrder = dispatchOrderServiceImpl.saveDispatchOrder(request, memberId);
            // 저장되면 출동지령 반환
            return new ResponseEntity<>(dispatchOrder, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("유효하지 않은 memberId", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("예기치 못한 오류 발생 ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 특정 출동 지령 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getDispatchOrder(@PathVariable Long orderId) {
        try {
            DispatchOrderDto.Response response = dispatchOrderServiceImpl.getDispatchOrder(orderId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("No DispatchOrder found with ID " + orderId, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 출동 지령정보 전달내역 조회



    @PostMapping("/1st-info")
    public ResponseEntity<?> createDispatchOrder(@RequestBody FirstDispatchOrderDto.FirstInfoRequest dto) {
        try {
            FirstDispatchOrderDto.Response response = dispatchOrderServiceImpl.createDispatchOrder(dto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid data: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/2nd-info")
    public ResponseEntity<?> createDispatchOrder2(@RequestBody SecondDispatchOrderDto.Request dto) {
        return ResponseEntity.ok(dispatchOrderServiceImpl.createDispatchOrder2(dto));
    }
}
