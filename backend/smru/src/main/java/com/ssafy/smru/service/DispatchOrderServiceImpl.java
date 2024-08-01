package com.ssafy.smru.service;

import com.ssafy.smru.dto.DispatchOrderDto;
import com.ssafy.smru.dto.FirstDispatchOrderDto;
import com.ssafy.smru.dto.SecondDispatchOrderDto;
import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.repository.DispatchOrderRepository;
import com.ssafy.smru.repository.WebMemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DispatchOrderServiceImpl {
    private final DispatchOrderRepository dispatchOrderRepository;
    private final WebMemberRepository webMemberRepository;

    public DispatchOrder saveDispatchOrder(DispatchOrderDto.Request dto, String memberId) {
        Optional<WebMember> webMemberOptional = webMemberRepository.findByMemberId(memberId);
        WebMember webMember = webMemberOptional.orElseThrow(() -> new IllegalArgumentException("유효하지 안흔 ID"));

        DispatchOrder dispatchOrder = dto.toEntity(webMember);
        return dispatchOrderRepository.save(dispatchOrder);
    }

    public DispatchOrderDto.Response getDispatchOrder(Long orderId) {
        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 ID " + orderId));
        return new DispatchOrderDto.Response(dispatchOrder);
    }
    public FirstDispatchOrderDto.Response createDispatchOrder(FirstDispatchOrderDto.FirstInfoRequest dto) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        WebMember webMember = webMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("No member found with ID " + memberId));

        DispatchOrder dispatchOrder = DispatchOrder.builder()
                .firestation(dto.getGwanhalId().toString()) // Assuming firestation is related to gwanhalId, adjust as needed
                .jibunLocationInfo(dto.getJibunLocationInfo())
                .doroLocationInfo(dto.getDoroLocationInfo())
                .emergencyType(dto.getEmergencyType())
                .reportedTime(dto.getReportedTime()) // 변경된 부분
                .reporterName(dto.getReporterName())
                .reporterPhone(dto.getReporterPhone())
                .reportDetails(dto.getReportDetail())
                .webMember(webMember)
                .build();

        DispatchOrder savedOrder = dispatchOrderRepository.save(dispatchOrder);

        return new FirstDispatchOrderDto.Response(savedOrder.getDispatchOrderId());
    }

    @Transactional
    public int createDispatchOrder2(SecondDispatchOrderDto.Request dto) {
        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(dto.getDispatchOrderId())
                .orElseThrow(() -> new NotFoundException(""));
        dispatchOrder.setSecondInfo(dto);

        return 0;
    }
}
