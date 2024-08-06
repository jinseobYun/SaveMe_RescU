package com.ssafy.smru.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RescueTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rescue_team_id")
    private Long rescueTeamId;

    @Column(name="team_name")
    private String teamName;

    @Column(name = "address")
    private String address;

    @Column(name="latitude")
    private String latitude;

    @Column(name="longitude")
    private String longitude;

    @Column(name="tel")
    private String tel;

    @Transient
    private BigDecimal distance;
}
