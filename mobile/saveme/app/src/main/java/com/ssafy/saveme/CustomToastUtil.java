package com.ssafy.saveme;

import android.app.Activity;
import android.content.Context;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

public class CustomToastUtil {
    private Context context;
    private Activity activity;

    public CustomToastUtil(Context context, Activity activity) {
        this.context = context;
        this.activity = activity;
    }

    public void showCustomToast(String message) {
        LayoutInflater inflater = activity.getLayoutInflater();
        View layout = inflater.inflate(R.layout.custom_toast, activity.findViewById(R.id.toast_layout_root));

        TextView text = layout.findViewById(R.id.toast_text);
        text.setText(message);

        Toast toast = new Toast(context.getApplicationContext());
        toast.setGravity(Gravity.CENTER_VERTICAL, 0, 0);
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(layout);
        toast.show();
    }
}
