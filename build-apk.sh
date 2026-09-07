#!/usr/bin/env bash
set -e

echo "=== 1. Building Vite Production Web Bundle ==="
npm run build

echo "=== 2. Creating Android Project Structure ==="
ROOT_DIR=$(pwd)
ANDROID_DIR="$ROOT_DIR/android"
APP_DIR="$ANDROID_DIR/app"
MAIN_DIR="$APP_DIR/src/main"
RES_DIR="$MAIN_DIR/res"
JAVA_DIR="$MAIN_DIR/java/com/pixelflow/app"
ASSETS_DIR="$MAIN_DIR/assets/www"
BUILD_DIR="$ANDROID_DIR/build_temp"
OUTPUT_DIR="$APP_DIR/build/outputs/apk/release"

mkdir -p "$JAVA_DIR"
mkdir -p "$MAIN_DIR/gen"
mkdir -p "$BUILD_DIR/classes"
mkdir -p "$OUTPUT_DIR"
mkdir -p "$RES_DIR/values"
mkdir -p "$RES_DIR/xml"
mkdir -p "$RES_DIR/drawable"
mkdir -p "$RES_DIR/mipmap-mdpi"
mkdir -p "$RES_DIR/mipmap-hdpi"
mkdir -p "$RES_DIR/mipmap-xhdpi"
mkdir -p "$RES_DIR/mipmap-xxhdpi"
mkdir -p "$RES_DIR/mipmap-xxxhdpi"
mkdir -p "$ASSETS_DIR"

echo "=== 3. Copying Web App to Android Assets ==="
rm -rf "$ASSETS_DIR"/*
cp -r "$ROOT_DIR/dist"/* "$ASSETS_DIR"/

echo "=== 4. Generating App Launcher Icons ==="
convert "$ROOT_DIR/public/pwa-512x512.png" -resize 48x48 "$RES_DIR/mipmap-mdpi/ic_launcher.png"
convert "$ROOT_DIR/public/pwa-512x512.png" -resize 72x72 "$RES_DIR/mipmap-hdpi/ic_launcher.png"
convert "$ROOT_DIR/public/pwa-512x512.png" -resize 96x96 "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
convert "$ROOT_DIR/public/pwa-512x512.png" -resize 144x144 "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
convert "$ROOT_DIR/public/pwa-512x512.png" -resize 192x192 "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"

# Also round versions
convert "$RES_DIR/mipmap-mdpi/ic_launcher.png" "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"
convert "$RES_DIR/mipmap-hdpi/ic_launcher.png" "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"
convert "$RES_DIR/mipmap-xhdpi/ic_launcher.png" "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"
convert "$RES_DIR/mipmap-xxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"
convert "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

echo "=== 5. Writing Android Resource Files ==="
cat << 'EOF' > "$RES_DIR/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Pixel Flow</string>
</resources>
EOF

cat << 'EOF' > "$RES_DIR/values/colors.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#06b6d4</color>
    <color name="background">#030712</color>
</resources>
EOF

cat << 'EOF' > "$RES_DIR/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@color/background</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
EOF

cat << 'EOF' > "$RES_DIR/xml/network_security_config.xml"
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
EOF

cat << 'EOF' > "$MAIN_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pixelflow.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:label="@string/app_name"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:networkSecurityConfig="@xml/network_security_config"
        android:usesCleartextTraffic="true">

        <activity
            android:name="com.pixelflow.app.MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:screenOrientation="portrait"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

echo "=== 6. Writing Java Source Code ==="
cat << 'EOF' > "$JAVA_DIR/MainActivity.java"
package com.pixelflow.app;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void vibrate(long milliseconds) {
            Vibrator v = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null && v.hasVibrator()) {
                v.vibrate(milliseconds);
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Immersive sticky fullscreen
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#030712"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return super.onConsoleMessage(consoleMessage);
            }
        });

        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

echo "=== 7. Writing Gradle Configuration Files for Android Studio ==="
cat << 'EOF' > "$ANDROID_DIR/build.gradle"
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
EOF

cat << 'EOF' > "$ANDROID_DIR/settings.gradle"
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "PixelFlow"
include ':app'
EOF

cat << 'EOF' > "$ANDROID_DIR/gradle.properties"
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
EOF

cat << 'EOF' > "$APP_DIR/build.gradle"
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.pixelflow.app'
    compileSdk 33

    defaultConfig {
        applicationId "com.pixelflow.app"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.webkit:webkit:1.6.1'
}
EOF

cat << 'EOF' > "$APP_DIR/proguard-rules.pro"
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
EOF

cat << 'EOF' > "$ANDROID_DIR/README.md"
# Pixel Flow! - Native Android Project

This folder contains the complete, production-ready Android Studio project for **Pixel Flow!**.

## Quick Structure:
- `app/src/main/AndroidManifest.xml` - Android package manifest
- `app/src/main/java/com/pixelflow/app/MainActivity.java` - Native WebView wrapper & hardware acceleration
- `app/src/main/res/` - Icons (all densities: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi), colors, styles
- `app/src/main/assets/www/` - Bundled offline game web assets
- `app/build/outputs/apk/release/PixelFlow.apk` - Compiled & signed Android APK

## How to Open in Android Studio:
1. Open Android Studio.
2. Choose **Open an Existing Project**.
3. Select this `android/` directory.
4. Click **Run** (`Shift + F10`) or **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
EOF

echo "=== 8. Compiling Android APK ==="
ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
DX_TOOL="/usr/lib/android-sdk/build-tools/debian/dx"

# Clean build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/classes"

echo "Generating R.java..."
aapt package -f -m \
    -J "$MAIN_DIR/gen" \
    -M "$MAIN_DIR/AndroidManifest.xml" \
    -S "$RES_DIR" \
    -I "$ANDROID_JAR"

echo "Compiling Java sources with javac..."
javac -source 8 -target 8 \
    -bootclasspath "$ANDROID_JAR" \
    -cp "$ANDROID_JAR" \
    -d "$BUILD_DIR/classes" \
    "$JAVA_DIR/MainActivity.java" \
    "$MAIN_DIR/gen/com/pixelflow/app/R.java"

echo "Dexing classes with dx..."
$DX_TOOL --dex --output="$BUILD_DIR/classes.dex" "$BUILD_DIR/classes"

echo "Packaging assets and resources with aapt..."
aapt package -f \
    -M "$MAIN_DIR/AndroidManifest.xml" \
    -S "$RES_DIR" \
    -A "$MAIN_DIR/assets" \
    -I "$ANDROID_JAR" \
    -F "$BUILD_DIR/unaligned.apk"

echo "Adding classes.dex to APK..."
cd "$BUILD_DIR"
aapt add unaligned.apk classes.dex
cd "$ROOT_DIR"

echo "Zip-aligning APK (4-byte alignment)..."
zipalign -f -v 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/aligned.apk"

echo "Signing APK with apksigner..."
KEYSTORE="$ANDROID_DIR/debug.keystore"
if [ ! -f "$KEYSTORE" ]; then
    echo "Creating signing keystore..."
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -storepass android \
        -alias androiddebugkey \
        -keypass android \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=Pixel Flow,O=PixelFlow,C=US"
fi

apksigner sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:android \
    --key-pass pass:android \
    --out "$OUTPUT_DIR/PixelFlow.apk" \
    "$BUILD_DIR/aligned.apk"

echo "Verifying APK signature..."
apksigner verify "$OUTPUT_DIR/PixelFlow.apk"

echo "=== 9. Copying APK to Accessible Locations ==="
cp "$OUTPUT_DIR/PixelFlow.apk" "$ROOT_DIR/public/PixelFlow.apk"
cp "$OUTPUT_DIR/PixelFlow.apk" "$ROOT_DIR/dist/PixelFlow.apk"
cp "$OUTPUT_DIR/PixelFlow.apk" "$ANDROID_DIR/PixelFlow.apk"

echo "=== BUILD COMPLETE! ==="
echo "APK location in project:"
echo "1. $ROOT_DIR/public/PixelFlow.apk (Web-downloadable at /PixelFlow.apk)"
echo "2. $ROOT_DIR/dist/PixelFlow.apk"
echo "3. $ANDROID_DIR/PixelFlow.apk"
echo "4. $OUTPUT_DIR/PixelFlow.apk"
ls -lh "$OUTPUT_DIR/PixelFlow.apk"
