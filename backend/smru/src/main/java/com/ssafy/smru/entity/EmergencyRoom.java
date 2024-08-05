package com.ssafy.smru.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("EmergencyRoom")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class EmergencyRoom {
    @Id
    private String hpid;
    private Integer hvec; // 응급실 가용병상
    private Integer hvoc; // 가용 수술실

    @Builder
    public EmergencyRoom(String hpid, Integer hvec, Integer hvoc) {
        this.hpid = hpid;
        this.hvec = hvec;
        this.hvoc = hvoc;
    }
}
