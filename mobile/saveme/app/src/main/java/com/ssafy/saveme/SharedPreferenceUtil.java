package com.ssafy.saveme;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

public class SharedPreferenceUtil {
    private Context context;

    public SharedPreferenceUtil(Context context) {
        this.context = context;
    }

    public String getDeviceTokenFromPreferences() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstants.PREFS_NAME, MODE_PRIVATE);
        return sharedPreferences.getString(AppConstants.KEY_FCM_TOKEN, null);
    }

    public void saveDeviceToken() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstants.PREFS_NAME, MODE_PRIVATE);
        // FCM 토큰을 가져와서 저장
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Toast.makeText(context, "FCM 토큰 가져오기 실패", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        // 새 FCM 토큰을 가져왔습니다.
                        String token = task.getResult();
                        Toast.makeText(context, "FCM 토큰을 성공적으로 가져왔습니다.", Toast.LENGTH_SHORT).show();
                        Toast.makeText(context, "FCM 토큰\n" + token, Toast.LENGTH_SHORT).show();
                        // 토큰을 SharedPreferences에 저장
                        SharedPreferences.Editor editor = sharedPreferences.edit();
                        editor.putString(AppConstants.KEY_FCM_TOKEN, token);
                        editor.apply();
                    }
                });
    }

    public boolean checkDeviceToken() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstants.PREFS_NAME, MODE_PRIVATE);
        String fcmToken = sharedPreferences.getString(AppConstants.KEY_FCM_TOKEN, null);
        Log.d("MainActivity", "FCM Token : " + fcmToken);
        return fcmToken != null;
    }

    public boolean checkLocationTerms() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(AppConstants.PREFS_NAME, MODE_PRIVATE);
        boolean locTerms = sharedPreferences.getBoolean(AppConstants.KEY_LOC_TERM, false);
        Log.d("MainActivity", "loc_terms : " + locTerms);
        return locTerms;
    }
}
