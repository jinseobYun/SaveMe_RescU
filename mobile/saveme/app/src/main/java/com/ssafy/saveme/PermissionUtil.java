package com.ssafy.saveme;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class PermissionUtil {
    private Context context;
    private Activity activity;
    private static final int MULTIPLE_PERMISSIONS = 1023;

    public static final int FIRST_REQ_CODE = 100;
    public static final int SECOND_REQ_CODE = 200;
    public static final String[] permissions = {
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
    };

    public PermissionUtil(Context context, Activity activity) {
        this.context = context;
        this.activity = activity;
    }

    public boolean checkPermission(Context context, Activity activity) {
        boolean allPermissionsGranted = true;

        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                allPermissionsGranted = false;
                break;
            }
        }
        return allPermissionsGranted;
    }

    public boolean onRequestPermissionsResult(int requestCode, int[] grantResults) {
        if (requestCode == FIRST_REQ_CODE) {
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    return false; // 권한이 하나라도 거부되면 false 반환
                }
            }
            return true; // 모든 권한이 허용되면 true 반환
        }
        return false;
    }

    public void requestPermission() {
        ActivityCompat.requestPermissions(activity, permissions, FIRST_REQ_CODE);
    }
}
