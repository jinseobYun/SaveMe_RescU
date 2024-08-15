package com.ssafy.saveme;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

public class WebAppInterface {
    private Context context;

    public WebAppInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public String getDeviceToken() {
        // 기기의 고유 토큰(예: FCM 토큰)을 반환
        SharedPreferenceUtil sharedPreferenceUtil = new SharedPreferenceUtil(context);
        return sharedPreferenceUtil.getDeviceTokenFromPreferences();
    }



}
