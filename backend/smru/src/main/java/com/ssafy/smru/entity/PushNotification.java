package com.ssafy.smru.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class PushNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pushNotificationId;

    @Column
    private String title;

    @Column
    private String body;

    @Column
    private LocalDateTime notificationTime;

    @OneToOne
    @JoinColumn(name = "app_member_id")
    private AppMember appMember;

    @Builder
    public PushNotification(Integer pushNotificationId, String title, String body, LocalDateTime notificationTime, AppMember appMember) {
        this.pushNotificationId = pushNotificationId;
        this.title = title;
        this.body = body;
        this.notificationTime = notificationTime;
        this.appMember = appMember;
    }
}
