package com.ssafy.smru.service;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.DispatchOrderListDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.repository.DispatchOrderRepository;
import com.ssafy.smru.repository.WebMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.webjars.NotFoundException;

import java.sql.Timestamp;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DispatchOrderServiceImpl {

    private final DispatchOrderRepository dispatchOrderRepository;
    private final WebMemberRepository webMemberRepository;

    // 출동 지령 정보 작성
    public DispatchOrder createDispatchOrder(DispatchOrderDto.Request dto) {
        WebMember webMember = webMemberRepository.findById(dto.getWebMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "WebMember not found"));

        DispatchOrder dispatchOrder = dto.toEntity(webMember);
        return dispatchOrderRepository.save(dispatchOrder);
    }

    // 출동 지령 리스트 페이징 메서드
    public Page<DispatchOrderListDto.Response> getFilteredDispatchOrders(String createdBy, Timestamp startDate, Timestamp endDate, Pageable pageable){
        Page<DispatchOrder> page = dispatchOrderRepository.findByCreatedByAndReportedTimeBetween(createdBy, startDate, endDate, pageable);

        // 엔티티 dto로변환
        return page.map(dispatchOrder -> new DispatchOrderListDto.Response(
                dispatchOrder.getDispatchOrderId(),
                dispatchOrder.getReportedTime(),
                dispatchOrder.getCreatedBy()
        ));
    }

    public DispatchOrderDto.Response getDispatchOrderById(Long dispatchOrderId){
        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(dispatchOrderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"출동지령을 찾을 수 없습니다?"));
     return new DispatchOrderDto.Response(dispatchOrder);
    }

    public void deleteDispatchOrderById (Long dispatchOrderId){
        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(dispatchOrderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"출동지령을 찾을 수 없습니다?"));
        dispatchOrderRepository.delete(dispatchOrder);
    }




//        // 2차 신고
//    @Transactional
//    public int createDispatchOrder2(SecondDispatchOrderDto.Request dto) {
//        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(dto.getDispatchOrderId())
//                .orElseThrow(() -> new NotFoundException(""));
//        dispatchOrder.setSecondInfo(dto);
//
//        return 0;
//    }
//
//    public DispatchOrder saveDispatchOrder(DispatchOrderDto.Request dto, String memberId) {
//        Optional<WebMember> webMemberOptional = webMemberRepository.findByMemberId(memberId);
//        WebMember webMember = webMemberOptional.
//                orElseThrow(() -> new IllegalArgumentException("유효하지 안흔 ID"));
//        DispatchOrder dispatchOrder = dto.toEntity(webMember);
//        return dispatchOrderRepository.save(dispatchOrder);
//    }
//        // 출동지령 조회
//    public DispatchOrderDto.Response getDispatchOrder(Long orderId) {
//        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(orderId)
//                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 ID " + orderId));
//        return new DispatchOrderDto.Response(dispatchOrder);
//    }
//        // 1차 신고
//    public FirstDispatchOrderDto.Response createDispatchOrder(FirstDispatchOrderDto.FirstInfoRequest dto) {
//        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
//        WebMember webMember = webMemberRepository.findByMemberId(memberId)
//                .orElseThrow(() -> new IllegalArgumentException("No member found with ID " + memberId));
//
//        DispatchOrder dispatchOrder = DispatchOrder.builder()
//                .firestation(dto.getGwanhalId().toString()) // Assuming firestation is related to gwanhalId, adjust as needed
//                .jibunLocationInfo(dto.getJibunLocationInfo())
//                .doroLocationInfo(dto.getDoroLocationInfo())
//                .emergencyType(dto.getEmergencyType())
//                .reportedTime(dto.getReportedTime()) // 변경된 부분
//                .reporterName(dto.getReporterName())
//                .reporterPhone(dto.getReporterPhone())
//                .reportDetails(dto.getReportDetail())
//                .webMember(webMember)
//                .build();
//
//        DispatchOrder savedOrder = dispatchOrderRepository.save(dispatchOrder);
//
//        return new FirstDispatchOrderDto.Response(savedOrder.getDispatchOrderId());
//    }
}
