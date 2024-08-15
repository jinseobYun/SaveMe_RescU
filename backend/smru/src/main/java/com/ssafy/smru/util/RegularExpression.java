package com.ssafy.smru.util;

import java.util.regex.Pattern;

public class RegularExpression {



    // 휴대폰 번호 검증
    public boolean isPhone(String phone){
        return Pattern.matches("^010\\d{8}$", phone);
    }

    // 숫자 검증
    public boolean isNumber(String number){
        return Pattern.matches("^[0-9]*$", number);
    }

    // 소수 검증
    public boolean isDecimal(String number){
        return Pattern.matches("^\\d+(\\.\\d+)?$", number);
    }

    //아이디 검즘
    public boolean isId(String id){
        return Pattern.matches("^[a-zA-Z0-9]+$", id);
    }

    // 이름 검증
    public boolean isName(String name){
        return Pattern.matches("^[가-힣]+$", name);
    }

}
