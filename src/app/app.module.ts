import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { Stripe } from '@ionic-native/stripe';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { MyApp } from './app.component';
import { OnBoardingSliderPage } from "../pages/on-boarding-slider/on-boarding-slider";
import { RegistrationTypeSelectPage } from "../pages/registration/registration-type-select/registration-type-select";
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { SignUpPage } from "../pages/registration/sign-up/sign-up";
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { ReactiveFormsModule } from "@angular/forms";
import { OtpVerifyPage } from "../pages/registration/otp-verify/otp-verify";
import { PhoneNumberPage } from "../pages/registration/phone-number/phone-number";
import { UsernamePage } from "../pages/registration/username/username";
import { LoginPage } from "../pages/login/login/login";
import { ForgotPasswordPage } from "../pages/login/forgot-password/forgot-password";
import { HomePage } from "../pages/user/home/home";
import { ProfilePage } from "../pages/vendor/profile/profile";
import { StripePage } from "../pages/vendor/stripe/stripe";
import { CreateCouponPage } from "../pages/vendor/create-coupon/create-coupon";
import { VendorProvider } from '../providers/vendor/vendor';
import { VendorHomePage } from "../pages/vendor-home/vendor-home";
import { MembershipPage } from "../pages/vendor/membership/membership";
import { CouponReviewPage } from "../pages/vendor/coupon-review/coupon-review";
import { FollowersPage } from "../pages/vendor/followers/followers";
import { VendorInventoryPage } from "../pages/vendor/vendor-inventory/vendor-inventory";
import { StatisticsPage } from "../pages/vendor/statistics/statistics";
import { ActiveRedeemersPage } from "../pages/vendor/reports/active-redeemers/active-redeemers";
import { MostMonthlyRedeemersPage } from "../pages/vendor/reports/most-monthly-redeemers/most-monthly-redeemers";
import { MostTodayRedeemersPage } from "../pages/vendor/reports/most-today-redeemers/most-today-redeemers";
import { LeastRedeemersPage } from "../pages/vendor/reports/least-redeemers/least-redeemers";
import { TabsPage } from "../pages/user/tabs/tabs";
import { StoreDetailPage } from "../pages/user/store-detail/store-detail";
import { TodatePipe } from '../pipes/todate/todate';
import { MapViewPage } from "../pages/user/map-view/map-view";
import { ModelCouponPopupPage } from "../pages/user/model-coupon-popup/model-coupon-popup";
import { ModelReedemCodePage } from "../pages/user/model-reedem-code/model-reedem-code";
import { PasswordChangePage } from "../pages/vendor/password-change/password-change";
import { WorkingHoursPage } from "../pages/vendor/working-hours/working-hours";
import { UserProfilePage } from "../pages/user/user-profile/user-profile";
import { TextMaskModule } from 'angular2-text-mask';
import { SplashVideoPage } from "../pages/splash-video/splash-video";
import { SelectFollowersPage } from "../pages/vendor/select-followers/select-followers";
import { FavoritesPage } from "../pages/user/favorites/favorites";
import { WalletPage } from "../pages/user/wallet/wallet";
import { UserUpdateProfilePage } from "../pages/user/user-update-profile/user-update-profile";
import { UserFollowersPage } from "../pages/user/user-followers/user-followers";
import { SettingPage } from '../pages/user/setting/setting';
import { NotificationPage } from '../pages/user/notification/notification';
import { ModelSaveCouponPage } from '../pages/user/model-save-coupon/model-save-coupon';
import { CouponPaymentPage } from '../pages/user/coupon-payment/coupon-payment';
import { BranchioProvider } from '../providers/branchio/branchio';
import { Badge } from '@ionic-native/badge';




@NgModule({
  declarations: [
    MyApp,
    OnBoardingSliderPage,
    RegistrationTypeSelectPage,
    SignUpPage,
    PhoneNumberPage,
    OtpVerifyPage,
    UsernamePage,
    LoginPage,
    ForgotPasswordPage,
    HomePage,
    ProfilePage,
    StripePage,
    CreateCouponPage,
    VendorInventoryPage,
    VendorHomePage,
    MembershipPage,
    CouponReviewPage,
    FollowersPage,
    StatisticsPage,
    ActiveRedeemersPage,
    MostMonthlyRedeemersPage,
    MostTodayRedeemersPage,
    LeastRedeemersPage,
    TabsPage,
    StoreDetailPage,
    TodatePipe,
    MapViewPage,
    ModelCouponPopupPage,
    ModelReedemCodePage,
    PasswordChangePage,
    WorkingHoursPage,
    UserProfilePage,
    SplashVideoPage,
    SelectFollowersPage,
    FavoritesPage,
    WalletPage,
    UserUpdateProfilePage,
    UserFollowersPage,
    SettingPage,
    NotificationPage,
    ModelSaveCouponPage,
    CouponPaymentPage


  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    TextMaskModule,
    
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: true,

     // statusbarPadding: true,
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),


  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OnBoardingSliderPage,
    RegistrationTypeSelectPage,
    SignUpPage,
    PhoneNumberPage,
    UsernamePage,
    OtpVerifyPage,
    LoginPage,
    ForgotPasswordPage,
    HomePage,
    ProfilePage,
    StripePage,
    CreateCouponPage,
    VendorHomePage,
    FollowersPage,
    VendorInventoryPage,
    MembershipPage,
    CouponReviewPage,
    StatisticsPage,
    ActiveRedeemersPage,
    MostMonthlyRedeemersPage,
    MostTodayRedeemersPage,
    LeastRedeemersPage,
    TabsPage,
    StoreDetailPage,
    MapViewPage,
    ModelCouponPopupPage,
    ModelReedemCodePage,
    PasswordChangePage,
    WorkingHoursPage,
    UserProfilePage,
    SplashVideoPage,
    SelectFollowersPage,
    FavoritesPage,
    WalletPage,
    UserUpdateProfilePage,
    UserFollowersPage,
    SettingPage,
    NotificationPage,
    ModelSaveCouponPage,
    CouponPaymentPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserServiceProvider,
    Network,
    Device,
    Stripe,
    Facebook,
    GooglePlus,
    ApiServiceProvider,
    ConfigServiceProvider,
    VendorProvider,
    File,
    Transfer,
    Camera,
    FilePath,
    Geolocation,
    Keyboard,
    Push,
    SocialSharing,
    BranchioProvider,
    Badge,
  
  
    
  ]
})
export class AppModule { }
