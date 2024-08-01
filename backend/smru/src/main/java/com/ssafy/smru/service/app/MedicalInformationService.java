// MedicalInformationService.java
package com.ssafy.smru.service.app;

import com.ssafy.smru.dto.app.DrugInfoDto;
import com.ssafy.smru.dto.app.MedCdiDto;
import com.ssafy.smru.dto.app.MedicalInformationDto;
import com.ssafy.smru.entity.AppMember;
import com.ssafy.smru.entity.app.*;
import com.ssafy.smru.exception.EntityExistsException;
import com.ssafy.smru.exception.ResourceNotFoundException;
import com.ssafy.smru.repository.AppMemberRepository;
import com.ssafy.smru.repository.app.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalInformationService {

    private final MedicalInformationRepository medicalInformationRepository;
    private final AppMemberRepository appMemberRepository;
    private final CdInfoRepository cdInfoRepository;
    private final DrugInfoRepository drugInfoRepository;
    private final MedCdiRepository medCdiRepository;
    private final MedicineRepository medicineRepository;



    public void createMedicalInformation(MedicalInformationDto.Request request) {
        AppMember appMember = appMemberRepository.findByMemberId(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException(request.getMemberId() + "는 등록되지 않은 사용자입니다."));
        // 이미 존재하는 경우 삭제
        if (appMember.getMedicalInformation() != null && appMember.getMedicalInformation().getMedicalInformationId() != null) {
                throw new EntityExistsException("이미 등록된 의료정보가 있습니다.");
        }
        // 메디컬 인포메이션 저장 후
        MedicalInformation medicalInformation = medicalInformationRepository.save(request.toEntity());
        appMember.changeMedicalInformation(medicalInformation);
        appMemberRepository.save(appMember);
        // 지병 정보 리스트가 있으면 저장
        if(request.getMedCdis() != null && !request.getMedCdis().isEmpty()){
            createMedCdi(medicalInformation,request.getMedCdis());
        }
        // 투약 정보 리스트가 있으면 저장
        if(request.getDrugInfos() != null && !request.getDrugInfos().isEmpty()){
            createDrucInfo(medicalInformation,request.getDrugInfos());
        }
    }

    @Transactional
    public void createMedCdi(MedicalInformation medicalInformation , List<Long> cdInfoIds) {
        // cdInfoIds 리스트의 아이디에 맞는 CdInfo를 DB에서 조회
        List<CdInfo> cdInfos = cdInfoRepository.findAllById(cdInfoIds);
        System.out.println(cdInfos);
        // DB에서 받은 지병 정보의 고유 아이디를 받아옴
        List<Long> foundCdInfoIds = cdInfos.stream().map(CdInfo::getCdInfoId).collect(Collectors.toList());
        // filter로 요청시 들어온 지병 코드와 db에서 불러온 지병 코드를 비교 해서
        // 없는 것들만 저장
        List<Long> invalidCdInfoIds = cdInfoIds.stream()
                .filter(id -> !foundCdInfoIds.contains(id))
                .collect(Collectors.toList());
        // 비어있지 않으면 예외처리
        if (!invalidCdInfoIds.isEmpty()) {
            throw new ResourceNotFoundException(invalidCdInfoIds + " 는 존재하지 않는 지병 코드입니다." );
        }
        List<MedCdi> medCdis = cdInfos.stream()
                .map(cdInfo -> MedCdi.builder()
                        .medicalInformation(medicalInformation)
                        .cdInfo(cdInfo)
                        .build())
                .collect(Collectors.toList());
        medCdiRepository.saveAll(medCdis);
    }
    public void createDrucInfo(MedicalInformation medicalInformation , List<Long> medicineIds){

        List<Medicine> medicines = medicineRepository.findAllById(medicineIds);
        List<Long> foundMedicineIds = medicines.stream().map(Medicine::getMedicineId).collect(Collectors.toList());
        List<Long> invalidMedicineIds = medicineIds.stream()
                .filter(id -> !foundMedicineIds.contains(id))
                .collect(Collectors.toList());
        // 비어있지 않으면 예외처리
        if (!invalidMedicineIds.isEmpty()) {
            throw new ResourceNotFoundException(invalidMedicineIds + " 는 존재하지 않는 약품 코드입니다." );
        }

        List<DrugInfo> drugInfos = medicines.stream()
                .map(medicine -> DrugInfo.builder()
                        .medicalInformation(medicalInformation)
                        .medicine(medicine)
                        .build())
                .collect(Collectors.toList());
        drugInfoRepository.saveAll(drugInfos);

    }

    // 아이디로 의료 정보 불러오기
    public  MedicalInformationDto.Response getMedicalInformationByMemberId(String memberId) {
        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("등록된 사용자가 아닙니다"));

        // 의료 정보 없는 경우 예외 처리
        if(member.getMedicalInformation() == null){
            throw new ResourceNotFoundException("등록된 의료 정보가 없습니다.");
        }
        MedicalInformation medicalInformation = member.getMedicalInformation();
        System.out.println(medicalInformation.getMedicalInformationId());



        List<DrugInfo> drugInfos = medicalInformation.getDrugInfos();
        List<MedCdi> medCdis = medicalInformation.getMedCdis();
        for (MedCdi medCdi : medCdis) {
            System.out.println(medCdi.getCdInfo().getCdInfoId());
        }
        MedicalInformationDto.Response response = MedicalInformationDto.Response.fromEntity(medicalInformation);
        response.setDrugInfos(drugInfos.stream().map(DrugInfoDto.Response::fromEntity).collect(Collectors.toList()));
        response.setMedCdis(medCdis.stream().map(MedCdiDto.Response::fromEntity).collect(Collectors.toList()));

        return response;
    }


    @Transactional
    public void modifyMedicalInformation(String memberId, MedicalInformationDto.Request request) {
        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("등록된 사용자가 없습니다."));
        if (member.getMedicalInformation() == null) {
            throw new ResourceNotFoundException("등록된 의료 정보가 없습니다.");
        }
        // 기존 의료 정보 삭제
        removeMedicalInformation(member.getMedicalInformation().getMedicalInformationId());
        // 멤버의 의료 정보 삭제
        member.changeMedicalInformation(null);
        appMemberRepository.save(member);
        // 새로운 의료 정보 등록
        request.setMemberId(memberId);
        createMedicalInformation(request);

    }

    @Transactional
    public void removeMedicalInformation(Long medicalInformationId) {

        MedicalInformation medicalInformation = medicalInformationRepository.findById(medicalInformationId)
                .orElseThrow(() -> new ResourceNotFoundException("등록된 의료 정보가 없습니다."));
        drugInfoRepository.deleteAll(medicalInformation.getDrugInfos());
        medCdiRepository.deleteAll(medicalInformation.getMedCdis());
        medicalInformationRepository.delete(medicalInformation);
    }

    @Transactional
    public void deleteRequestProcess(String memberId) {
        AppMember member = appMemberRepository.findByMemberId(memberId)
                .orElseThrow(()-> new ResourceNotFoundException("등록된 사용자가 없습니다."));
        if (member.getMedicalInformation() == null) {
            throw new ResourceNotFoundException("등록된 의료 정보가 없습니다.");
        }
//        Optional<Long> medicalInformationId = appMemberRepository.findMedicalInformationIdByMemberId(memberId);
//        if (medicalInformationId.isPresent()) {
//            System.out.println(medicalInformationId.get());
//        }
        // 기존 의료 정보 삭제
        removeMedicalInformation(member.getMedicalInformation().getMedicalInformationId());

        // 멤버의 의료 정보 삭제
        member.changeMedicalInformation(null);
        appMemberRepository.save(member);
    }
}
