package com.ssafy.smru.util;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class DistanceUtil {

    private static final BigDecimal EARTH_RADIUS = new BigDecimal("6378.135"); // 지구 반지름 (단위: km)
    private static final MathContext MATH_CONTEXT = new MathContext(10, RoundingMode.HALF_UP);

    public static BigDecimal calculateDistance(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        BigDecimal dLat = lat2.subtract(lat1, MATH_CONTEXT).multiply(BigDecimal.valueOf(Math.PI / 180), MATH_CONTEXT);
        BigDecimal dLon = lon2.subtract(lon1, MATH_CONTEXT).multiply(BigDecimal.valueOf(Math.PI / 180), MATH_CONTEXT);

        BigDecimal a = BigDecimal.valueOf(Math.sin(dLat.divide(BigDecimal.valueOf(2), MATH_CONTEXT).doubleValue())).pow(2)
                .add(BigDecimal.valueOf(Math.cos(lat1.multiply(BigDecimal.valueOf(Math.PI / 180), MATH_CONTEXT).doubleValue()))
                        .multiply(BigDecimal.valueOf(Math.cos(lat2.multiply(BigDecimal.valueOf(Math.PI / 180), MATH_CONTEXT).doubleValue())))
                        .multiply(BigDecimal.valueOf(Math.sin(dLon.divide(BigDecimal.valueOf(2), MATH_CONTEXT).doubleValue())).pow(2)));

        BigDecimal c = BigDecimal.valueOf(2).multiply(BigDecimal.valueOf(Math.atan2(Math.sqrt(a.doubleValue()), Math.sqrt(BigDecimal.ONE.subtract(a, MATH_CONTEXT).doubleValue()))));
        return EARTH_RADIUS.multiply(c, MATH_CONTEXT).setScale(2, RoundingMode.HALF_UP);

    }
}
