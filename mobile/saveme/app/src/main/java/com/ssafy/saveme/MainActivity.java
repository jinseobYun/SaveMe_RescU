package com.ssafy.saveme;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.gun0912.tedpermission.normal.TedPermission;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private Context context;
    private Activity activity;
    private PermissionUtil permissionUtil;
    private CustomToastUtil toastUtil;

    private static final String URL_MAIN = "https://i11b305.p.ssafy.io/app/";
    private static final String URL_NFC_REPORT = "https://i11b305.p.ssafy.io/app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        activity = this;
        permissionUtil = new PermissionUtil(this, this);
        toastUtil = new CustomToastUtil(this, this);

        if (!permissionUtil.checkPermission(context, activity)) {
            showCustomDialog();
        }
        setContentView(R.layout.activity_main);
        // URI 스킴을 통해 전달된 데이터를 처리
        Intent intent = getIntent();
        Uri uri = intent.getData();
        if (uri != null) {
            String scheme = uri.getScheme();
            String host = uri.getHost();
            // URI를 통해 전달된 데이터를 처리
            // 예: saveme://open?tagId=123456
            String tagId = uri.getQueryParameter("tagId");
            toastUtil.showCustomToast("NFC 태깅 감지됨.\ntagId = " + tagId);
            initializeWebView(URL_NFC_REPORT);
        } else {
            initializeWebView(URL_MAIN);
        }

    }

    private void initializeWebView(String url) {
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        //webSettings.setUseWideViewPort(true);
        //webSettings.setLoadWithOverviewMode(true);
        //webSettings.setBuiltInZoomControls(true);
        //webSettings.setSupportZoom(false);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);  // 자동 재생 허용

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                request.grant(request.getResources());
            }
        });
        webView.loadUrl(url);

        // 새로운 OnBackPressedCallback을 추가하여 뒤로 가기 동작을 설정합니다.
        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    // 기본 뒤로 가기 동작을 수행합니다.
                    finish();
                }
            }
        };
        getOnBackPressedDispatcher().addCallback(this, callback);
    }

    private void showCustomDialog() {
        final Dialog dialog = new Dialog(this, R.style.FullScreenDialogTheme);
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.permission_dialog, null);
        dialog.setContentView(dialogView);

        dialogView.findViewById(R.id.dialog_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                if (!permissionUtil.checkPermission(context, activity)) {
                    TedPermission.create()
                            .setPermissionListener(new CustomPermissionListener(context, activity))
                            .setDeniedTitle("알림")
                            .setDeniedMessage("권한이 거부되었습니다.\n[설정] > [권한] 에서 권한을 허용해야 합니다.")
                            .setPermissions(PermissionUtil.permissions)
                            .setDeniedCloseButtonText("종료")
                            .setGotoSettingButtonText("설정")
                            .check();
                }
            }
        });
        dialog.show();
    }
}
