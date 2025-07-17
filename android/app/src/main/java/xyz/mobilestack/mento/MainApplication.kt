package xyz.mobilestack.mento

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
// @generated begin @divvi/mobile/main-application-user-agent-imports - expo prebuild (DO NOT MODIFY) sync-14b2d9527851475ac6ba838bbf70c62330a50984
import android.os.Build
import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient
import okhttp3.Interceptor
import okhttp3.Request
import okhttp3.Response
// @generated end @divvi/mobile/main-application-user-agent-imports

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
// @generated begin @divvi/mobile/main-application-user-agent-code - expo prebuild (DO NOT MODIFY) sync-abcb430f09b4e16ecfece47787848fd3a34b4059

OkHttpClientProvider.setOkHttpClientFactory(object : OkHttpClientFactory {
    override fun createNewNetworkModuleClient(): OkHttpClient {
        return OkHttpClientProvider.createClientBuilder(this@MainApplication)
            .addInterceptor(Interceptor { chain ->
                val originalRequest = chain.request()
                val requestWithUserAgent = originalRequest
                    .newBuilder()
                    .removeHeader("User-Agent")
                    .addHeader(
                        "User-Agent",
                        "cKash/%s (Android %s; %s)".format(
                            BuildConfig.VERSION_NAME,
                            Build.VERSION.RELEASE,
                            Build.MODEL
                        )
                    )
                    .build()
                chain.proceed(requestWithUserAgent)
            })
            .build()
    }
})

// @generated end @divvi/mobile/main-application-user-agent-code
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
