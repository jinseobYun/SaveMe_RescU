package com.ssafy.smru.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Getter
public class GeoCoderResponseDto {
    private List<Document> documents;

    public static class Document {
        @JsonProperty("road_address")
        private RoadAddress roadAddress;
        private Address address;

        public RoadAddress getRoadAddress() {
            return roadAddress;
        }
        public Address getAddress() {
            return address;
        }
    }

    @Getter
    public static class RoadAddress {
        @JsonProperty("address_name")
        private String addressName;
    }

    @Data
    public static class Address {
        @JsonProperty("address_name")
        private String addressName;
    }
}




