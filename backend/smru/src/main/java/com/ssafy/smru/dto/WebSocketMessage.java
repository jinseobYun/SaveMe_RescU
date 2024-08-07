package com.ssafy.smru.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;
import java.util.Objects;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String sender;
    private String type;
    private Long roomId;
    private String data;
    private List<String> allUsers;
    private String receiver;
    private Object offer;
    private Object answer;
    private Object candidate;
    private Object sdp;

}