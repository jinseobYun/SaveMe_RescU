package com.ssafy.smru.service;

import com.ssafy.smru.dto.*;
import com.ssafy.smru.entity.DispatchOrder;
import com.ssafy.smru.entity.WebMember;
import com.ssafy.smru.repository.DispatchOrderRepository;
import com.ssafy.smru.repository.WebMemberRepository;
import com.ssafy.smru.repository.app.MedicalInformationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class DispatchOrderServiceImpl implements DispatchOrderService{

    private final DispatchOrderRepository dispatchOrderRepository;
    private final MedicalInformationRepository medicalInformationRepository;
    private final WebMemberRepository webMemberRepository;

    // 출동 지령 리스트 페이징 메서드
    public Page<DispatchOrderListDto.Response> getFilteredDispatchOrders(String createdBy, Date startDate, Date endDate, Pageable pageable) {
        Timestamp startTimestamp = startDate != null ? new Timestamp(startDate.getTime()) : null;
        Timestamp endTimestamp = endDate != null ? new Timestamp(endDate.getTime()) : null;

        Page<DispatchOrder> page = dispatchOrderRepository.findByCreatedByAndReportedTimeBetween(createdBy, startTimestamp, endTimestamp, pageable);

        // 엔티티 dto로 변환
        return page.map(dispatchOrder -> new DispatchOrderListDto.Response(
                dispatchOrder.getDispatchOrderId(),
                dispatchOrder.getReportedTime(),
                dispatchOrder.getCreatedBy()
        ));
    }


    // 상세 조회
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

    // 1차 출동지령정보 작성
    public DispatchOrder createFirstOrder(FirstDispatchOrderDto.FirstInfoRequest request) {
//        WebMember webMember = webMemberRepository.findById(1L)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid rescue team ID"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        WebMember currentUser= webMemberRepository.findByMemberId(currentUsername)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 Id"));

        DispatchOrder dispatchOrder = DispatchOrder.builder()
                .firestation(request.getFirestation())
                .doroLocationInfo(request.getDoroLocationInfo())
                .jibunLocationInfo(request.getJibunLocationInfo())
                .emergencyType(request.getEmergencyType())
                .reportedTime(Timestamp.valueOf(LocalDateTime.now()))
                .reporterName(request.getReporterName())
                .reporterPhone(request.getReporterPhone())
                .reportDetails(request.getReportDetail())
                .webMember(currentUser)
                .createdBy(currentUser.getName())
                .build();
        System.out.println(dispatchOrder.toString());
        return dispatchOrderRepository.save(dispatchOrder);

    }
    // 2차 출동지령정보 작성
    public DispatchOrder updateSecondOrder(SecondDispatchOrderDto.Request request) {
        DispatchOrder dispatchOrder = dispatchOrderRepository.findById(request.getDispatchOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid dispatch order ID"));

        dispatchOrder.setHospitalName(request.getHospitalName());
        dispatchOrder.setMemberName(request.getMemberName());
        dispatchOrder.setGender(request.getGender());
        dispatchOrder.setBirth(request.getBirth());
        dispatchOrder.setBloodType1(request.getBloodType1());
        dispatchOrder.setBloodType2(request.getBloodType2());
        dispatchOrder.setChronicDisease(String.join(",", request.getChronicDisease()));
        dispatchOrder.setDrugInfos(String.join(",", request.getDrugInfos()));
        dispatchOrder.setOtherInfo(request.getOtherInfo());

        return dispatchOrderRepository.save(dispatchOrder);
    }





}
