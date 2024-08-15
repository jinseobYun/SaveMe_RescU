package com.ssafy.saveme;

import android.app.Activity;
import android.content.Context;

import com.gun0912.tedpermission.PermissionListener;

import java.util.List;

public class CustomPermissionListener implements PermissionListener {
    private Context context;
    private Activity activity;

    public CustomPermissionListener(Context context, Activity activity) {
        this.context = context;
        this.activity = activity;
    }

    @Override
    public void onPermissionGranted() {

    }

    @Override
    public void onPermissionDenied(List<String> deniedPermissions) {
        CustomToastUtil customToastUtil = new CustomToastUtil(context, activity);
        // 1초 뒤에 종료
        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        customToastUtil.showCustomToast("권한 허용 후 앱 사용이 가능합니다.");
                        activity.finish();
                    }
                }, 500);
    }
}
