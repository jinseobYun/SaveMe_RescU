package com.ssafy.smru.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DrugUtil {
    // 약 정보가 아직 DB에 없음
    public static String toString(List<Integer> drugInfos) {
        String result = ""; // 여기에 repo 로부터 문자열 정보를 받음
        return result;
    }
}
