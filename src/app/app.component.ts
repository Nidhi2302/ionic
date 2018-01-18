import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { HomePage } from '../pages/home/home';
import { OnBoardingSliderPage } from "../pages/on-boarding-slider/on-boarding-slider";
import { RegistrationTypeSelectPage } from "../pages/registration/registration-type-select/registration-type-select";
import { LoginPage } from "../pages/login/login/login";
import { Network } from '@ionic-native/network';
import { StripePage } from "../pages/vendor/stripe/stripe";
import { ProfilePage } from "../pages/vendor/profile/profile";
import { CreateCouponPage } from "../pages/vendor/create-coupon/create-coupon";
import { ConfigServiceProvider } from "../providers/config-service/config-service";
import { HomePage } from "../pages/user/home/home";
import { User } from "../models/user";
import { VendorHomePage } from "../pages/vendor-home/vendor-home";
import { UserServiceProvider } from "../providers/user-service/user-service";
import { MembershipPage } from "../pages/vendor/membership/membership";
import { CouponReviewPage } from "../pages/vendor/coupon-review/coupon-review";
import { FollowersPage } from "../pages/vendor/followers/followers";
import { VendorInventoryPage } from "../pages/vendor/vendor-inventory/vendor-inventory";
import { StatisticsPage } from "../pages/vendor/statistics/statistics";
import { TabsPage } from "../pages/user/tabs/tabs";
import { Keyboard } from "@ionic-native/keyboard";
import { SplashVideoPage } from "../pages/splash-video/splash-video";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BranchioProvider } from '../providers/branchio/branchio';

declare var google: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  //rootPage: any =RegistrationTypeSelectPage ;
  loginUserData;
  showSlider = true;
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "assets/business-logo/user-default.png";
  pages: Array<{ title: string, component: any }>;
  options: PushOptions = {
    android: {},
    ios: {
      alert: "true",
      badge: false,
      clearBadge : true,
      sound: "true"
    },
    windows: {},
    browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    }
  }
  branchUniversalObj = null
  constructor(public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private network: Network,
    private events: Events,
    public config: ConfigServiceProvider,
    public userService: UserServiceProvider, private keyboard: Keyboard,
    private push: Push,
    public branch: BranchioProvider,
    public alertCtrl: AlertController
  ) {
    this.menu.enable(false);
    this.initializeApp();

    this.pages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'Create', component: CreateCouponPage },
      { title: 'Inventory', component: VendorInventoryPage },
      { title: 'Statistics', component: StatisticsPage },
      { title: 'Followers', component: FollowersPage },
      { title: 'Membership', component: MembershipPage },
      { title: 'Logout', component: CreateCouponPage }
    ];
    this.events.subscribe("Login", () => {
      this.startApp();
    })
  }
  initializeApp() {
    let self = this;
    self.config.isConnect = true;
    self.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      self.statusBar.styleDefault();
      self.splashScreen.hide();
      self.menu.enable(false);
      //self.rootPage=OnBoardingSliderPage;
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        self.config.isConnect = false;
      });
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network was connected :-)');
        self.config.isConnect = true;
      });

      if (this.network.type == "none") {
        self.config.isConnect = false;
      }
      self.startApp();
      this.keyboard.hideKeyboardAccessoryBar(false);

      /*Push Notification*/
      // to check if we have permission

      if (window.hasOwnProperty("cordova")) {
        console.log("You're on a mobile device");

        const pushObject: PushObject = this.push.init(this.options);
        pushObject.on('registration').subscribe((registration: any) => {
          console.log('Device registered', registration)
          this.config.setLocalStore("RegistrationId", registration.registrationId);
        });
        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
        
      } else {
        console.log("You're not on a mobile device-----");
      }

      self.platform.resume.subscribe(() =>{
        console.log("resume app",this.platform.is('cordova'));
        if (this.platform.is('cordova')) {
          let Branch = window['Branch'];
          Branch.initSession(data => {
            console.log("branchInit got sessiondfdfd", data);
             if (data['+clicked_branch_link']) {
              self.events.publish("branchEvent",data);
             }
           }, err => {
             console.log("branchInit not got session", err);
            
           });
         }
      })
    });
    
  }

  startApp() {
    let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loginUserData = new User(value);
      self.config.getLocalStore("profilePic").then((value) => {
        console.log(value);
        if (value) {
          this.businessLogo = value;
        } else {
          this.businessLogo = "assets/business-logo/user-default.png";
        }

      }, error => { console.log("profile pic", error); }).catch((err) => {
        console.log(err);
      })
      self.config.getLocalStore("backgroundPic").then((value) => {
        // console.log(value);
        if (value) {
          this.businessBack = value;
        } else {
          this.businessBack = "assets/business-image/VendorDefault.jpg";
        }
      }).catch((err) => {
        console.log(err);
      })
      self.navigateUser();
    }).catch((err) => {
      console.log("here123", err);
      //console.log(self.menu.enable(false));
      self.menu.enable(false);
      //self.rootPage =  OnBoardingSliderPage;
      self.rootPage = SplashVideoPage;
    });

  }

  

  openPage(page) {
    if (page.title == "Logout") {
      this.logout();
    } else {
      this.menu.close();
      this.rootPage = page.component;
    }

  }

  navigateUser() {
    console.log('LoggedUser', this.loginUserData);
    let self = this;
    if (self.loginUserData) {
      if (self.loginUserData['type'] == "user") {
        
        self.rootPage = TabsPage;
        // self.rootPage=HomePage;
      } else if (self.loginUserData['type'] == "vendor") {
        if (self.loginUserData['verified']) {
          if (self.loginUserData['isSubscribe']) {
            self.menu.enable(true);
            //self.rootPage=StatisticsPage;
            self.rootPage = ProfilePage;
          }
          else {
            self.rootPage = StripePage;
          }
        }
        else {
          self.nav.setRoot(LoginPage, { "type": "vendor" });
        }
      }
      else {
        self.rootPage = SplashVideoPage;
        //self.config.setLocalStore("showSlider", false);
      }

    }
  }


  menuOpened() {
    let self = this;

    this.events.subscribe('fromCoupon', page => {
      self.rootPage = page
    });
    self.config.getLocalStore("profilePic").then((value) => {
      if (value) {
        self.businessLogo = value;
        console.log("menuOpened called", value, self.businessLogo);
      } else {
        self.businessLogo = "assets/business-logo/user-default.png";
      }
    }, error => { console.log("profile pic", error); }).catch((err) => {
      self.businessLogo = "assets/business-logo/user-default.png";
      console.log(err);
    })
    self.config.getLocalStore("backgroundPic").then((value) => {
      if (value) {
        self.businessBack = value;
      } else {
        self.businessBack = "assets/business-image/VendorDefault.jpg";
      }
    }).catch((err) => {
      self.businessBack = "assets/business-image/VendorDefault.jpg";
      console.log(err);
    })
  }
  logout() {
    let self = this;
    let settings = {
      newQupeyNotify: self.loginUserData["newQupeyNotify"],
      expQupeyNotify: self.loginUserData["expQupeyNotify"],
      redemptionNotify: self.loginUserData["redemptionNotify"],
      newBusinessNotify: self.loginUserData["newBusinessNotify"],
    }
    const alert = this.alertCtrl.create({
      message:"Are you sure, you want to Logout?" ,
      title: "Alert",
      buttons: [{
        text:'Ok',
        handler:()=>{
          self.config.showLoading();
          self.userService.logout(settings, self.loginUserData["secretToken"]).then((res) => {
            self.config.hideloading();
            self.nav.setRoot(LoginPage, { "type": "vendor" });
            self.config.setLocalStore("showSlider", false);
            self.menu.close();
            self.menu.enable(false)
          });
        }
      },
      {
      text:'Cancel',
      handler: () => {
        self.config.hideloading();
        console.log('Cancel clicked');
      }
       } ]
    });
    alert.present();
    
  }
}

