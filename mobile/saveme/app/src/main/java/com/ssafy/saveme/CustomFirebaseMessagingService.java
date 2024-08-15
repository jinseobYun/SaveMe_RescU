package com.ssafy.saveme;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class CustomFirebaseMessagingService extends FirebaseMessagingService {
    private static final String CHANNEL_ID = "default_channel_id";
    private static final String CHANNEL_NAME = "Default Channel";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // 전달된 URL을 가져옴 (data 페이로드 사용)
        String url = remoteMessage.getData().get("url");

        // 알림 클릭 시 열릴 액티비티와 URL 전달 설정
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("url", url);  // URL을 인텐트에 추가

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);

        // 알림 권한 확인 (API 33 이상)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                // 권한이 없으면 권한 요청 또는 알림 표시 안함
                return;
            }
        }

        // NotificationManagerCompat를 통해 알림 매니저 생성
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getApplicationContext());

        // 안드로이드 오레오(API 26) 이상에서 알림 채널 필요
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // 알림 채널이 존재하지 않으면 생성
            if (notificationManager.getNotificationChannel(CHANNEL_ID) == null) {
                NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
                notificationManager.createNotificationChannel(channel);
            }
        }

        // RemoteMessage로부터 알림 데이터 가져오기
        String title = remoteMessage.getNotification() != null ? remoteMessage.getNotification().getTitle() : "Default Title";
        String body = remoteMessage.getNotification() != null ? remoteMessage.getNotification().getBody() : "Default Body";

        // 알림 빌더 설정
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(R.drawable.ic_launcher_background)
                .setPriority(NotificationCompat.PRIORITY_HIGH) // 알림 우선순위를 높여 상단에 표시되도록 설정
                .setAutoCancel(true) // 알림 클릭 시 자동 제거
                .setContentIntent(pendingIntent); // 알림 클릭 시 실행될 인텐트 설정

        // 알림 생성 및 표시
        Notification notification = builder.build();
        notificationManager.notify(1, notification);
        Log.d("[Testing]", "푸시 알림 수신");
    }
}
