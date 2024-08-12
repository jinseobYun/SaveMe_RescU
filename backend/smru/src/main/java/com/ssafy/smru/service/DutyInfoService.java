    package com.ssafy.smru.service;

    import com.ssafy.smru.dto.HospitalDTO;
    import com.ssafy.smru.entity.DutyInfo;
    import com.ssafy.smru.entity.EmergencyRoom;
    import com.ssafy.smru.repository.DutyInfoRepository;
    import com.ssafy.smru.util.DistanceUtil;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.redis.core.RedisTemplate;
    import org.springframework.stereotype.Service;

    import java.math.BigDecimal;
    import java.util.Comparator;
    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class DutyInfoService {

        private final DutyInfoRepository dutyInfoRepository;
        private final RedisTemplate<String, EmergencyRoom> redisTemplate;

        // 가장 가까운 병원 찾는 매서드
        public List<HospitalDTO> findNearestHospitals(String lat, String lon) {
            // 위 경도를 bigdecimal로 바꿈 ( 소수점 정확한 계산 )
            BigDecimal latitude = new BigDecimal(lat);
            BigDecimal longitude = new BigDecimal(lon);
            // db에서 모든 병원 정보를 가져옴
            List<DutyInfo> hospitals = dutyInfoRepository.findAll();

            // 각 병원과 주어진 위경도와 거리 계산 후 가장 가까운 5개만 뽑아서
            // HospitalDTO 객체로 만들어줌
            return hospitals.stream()
                    .sorted(Comparator.comparing(h -> DistanceUtil.calculateDistance(
                            latitude,
                            longitude,
                            h.getLatitude(),
                            h.getLongitude()
                    )))
                    .limit(5)
                    .map(h -> HospitalDTO.builder()
                            .hpid(h.getHpid())
                            .dutyAddr(h.getDutyAddr())
                            .dutyEmcls(h.getDutyEmcls())
                            .dutyEmclsName(h.getDutyEmclsName())
                            .dutyName(h.getDutyName())
                            .dutyTel1(h.getDutyTel1())
                            .dutyTel3(h.getDutyTel3())
                            .phpid(h.getPhpid())
                            .latitude(h.getLatitude())
                            .longitude(h.getLongitude())
                            .distance(DistanceUtil.calculateDistance(latitude, longitude, h.getLatitude(), h.getLongitude()) + " km")
                            .build()
                    )
                    .collect(Collectors.toList());
        }


        // Redis에서 실시간 병동 현황 가져오기
        public List<EmergencyRoom> getEmergencyRoomList() {
            return redisTemplate.opsForList().range("EmergencyRoomList", 0, -1);
        }


        // hpId 리스트를 통해 필터링된 EmergencyRoom 리스트 생성
        public List<EmergencyRoom> getFilteredEmergencyRoomListByHpIds(List<HospitalDTO> hospitals) {

            // 응급실 정보리스트에서 아이디만 가져오기
            List<String> hpIds = hospitals.stream()
                    .map(HospitalDTO::getHpid)
                    .collect(Collectors.toList());

            // 실시간 응급실 현황 전체 가져오기
            List<EmergencyRoom> emergencyRoomList = getEmergencyRoomList();
            if (emergencyRoomList != null && !emergencyRoomList.isEmpty()) {
                // 실시간 응급실해서 현재 가져오려고하는 응급실들만 가져와서 리턴해줌
                List<EmergencyRoom> erRoom = emergencyRoomList.stream()
                        .filter(room -> hpIds.contains(room.getHpid()))
                        .collect(Collectors.toList());
                return erRoom;
            }
            return null;
        }


        // 가장 가까운 병동 리스트에 실시간 병상 현황 추가하는 매서드
        // 필터링된 EmergencyRoom 리스트를 사용하여 HospitalDTO에 추가
        public List<HospitalDTO> addEmergencyRoomInfoToHospitals(List<HospitalDTO> hospitals) {


            List<EmergencyRoom> filteredEmergencyRooms = getFilteredEmergencyRoomListByHpIds(hospitals);

            if(filteredEmergencyRooms != null && !filteredEmergencyRooms.isEmpty()) {
                hospitals.forEach(hospital -> {
                    filteredEmergencyRooms.stream()
                            .filter(room -> room.getHpid().equals(hospital.getHpid()))
                            .findFirst()
                            .ifPresent(hospital::addEmergencyRoomInfo);
                });
            }

            return hospitals;
        }
    }
