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
import com.ssafy.smru.service.elasticsearch.ElasticSearchService;
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
    private final ElasticSearchService elasticSearchService;



    @Transactional
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

    @Transactional
    public void createDrucInfo(MedicalInformation medicalInformation , List<Long> medicineIds){


        // ES 서버에서 id 로 검색
        List<MedicineEs> medicines = elasticSearchService.searchByMedicineIds(medicineIds);

        // 검색한 Medicine ES 결과값에서 다시 아이디를 받아옴
        List<Long> foundMedicineIds = medicines.stream().map(MedicineEs::getMedicineId).collect(Collectors.toList());
        // 요청시에 포함된 id 와 es에 검색한 결과의 id 들을 비교해서
        // 없는 것들만 리스트에 넣어줌
        List<Long> invalidMedicineIds = medicineIds.stream()
                .filter(id -> !foundMedicineIds.contains(id))
                .collect(Collectors.toList());
        // 리스트가 비어있지 않으면 예외처리
        if (!invalidMedicineIds.isEmpty()) {
            throw new ResourceNotFoundException(invalidMedicineIds + " 는 존재하지 않는 약품 코드입니다." );
        }

        // ES Document 객체인  medicinees를 entity인 medicine으로 변환
        List<Medicine> toMedicines = medicines.stream().map(MedicineEs::toMedicine).collect(Collectors.toList());
        // 사용자의 drugInfos( 투약 정보 ) 에 담아줌
        List<DrugInfo> drugInfos = toMedicines.stream()
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
            return null;
        }
        MedicalInformation medicalInformation = member.getMedicalInformation();

        List<DrugInfo> drugInfos = medicalInformation.getDrugInfos();
        List<MedCdi> medCdis = medicalInformation.getMedCdis();
        for (MedCdi medCdi : medCdis) {
            System.out.println(medCdi.getCdInfo().getCdInfoId());
            System.out.println(medCdi.getCdInfo().getCdName());
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
