import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";
import { Device } from '@ionic-native/device';
import { HomePage } from "../../user/home/home";
import { ProfilePage } from "../../vendor/profile/profile";
import { StripePage } from "../../vendor/stripe/stripe";
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from '@ionic-native/google-plus';
import { CreateCouponPage } from "../../vendor/create-coupon/create-coupon";
import { VendorHomePage } from "../../vendor-home/vendor-home";
import { User } from "../../../models/user";
import { SignUpPage } from "../../registration/sign-up/sign-up";
import { StatisticsPage } from "../../vendor/statistics/statistics";
import { TabsPage } from "../../user/tabs/tabs";
import { PushObject, Push, PushOptions } from '@ionic-native/push';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //registerData
  userType
  loggedinUser
  isPrevious=false;
  device_token=null
  public loginForm: FormGroup;
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    private device: Device,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    public events:Events,
    private push: Push
  ) {

    this.userType = this.navParams.get("type");
    this.loginForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
     let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = 'none';
    }
    
    // this.config.getLocalStore("RegistrationId").then((RegistrationId) => {
    //   this.device_token = RegistrationId;
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    const pushObject: PushObject = this.push.init(this.options);
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
      this.device_token = registration.registrationId;
      this.config.setLocalStore("RegistrationId", registration.registrationId);
    });
  }
  // ionViewWillEnter() {
  //   console.log('Device registered')
  //   const pushObject: PushObject = this.push.init(this.options);
  //   pushObject.on('registration').subscribe((registration: any) => {
  //     console.log('Device registered', registration)
  //     this.device_token = registration.registrationId;
  //     this.config.setLocalStore("RegistrationId", registration.registrationId);
  //   });
    
  // }
  login(data, isValid) {
    if (isValid) {
      //call otp api
      this.config.showLoading();
      this.config.printLog('inside otp next', data);
      let loginData = {
        "username": data.userName,
        "password": data.password,
        "device_token": this.device_token,
        "type":this.userType,
        "device_type":this.device.platform
      }
      let self=this;
      //this.config.printLog("loginData",loginData);
      this.userService.login(loginData).then((reaponse) => {
        this.config.printLog('inside userService.login', reaponse);
        this.config.hideloading();

        //if(this.userType == reaponse.type){
          if (this.userType == "user"  ) {
          this.navCtrl.setRoot(TabsPage);
          //this.navCtrl.push(HomePage);
          
        } else {
          self.events.publish("Login");
          if(reaponse.verified==true){
            if(reaponse.isSubscribe){
              this.navCtrl.setRoot(ProfilePage);
              //this.navCtrl.push(StatisticsPage);
            }
            else{
               this.navCtrl.setRoot(StripePage);
            }
           
          }
          else{
            this.config.showToast(reaponse);
          }
          
        }
       
      }).catch(error => {
        this.config.hideloading();
      });
    }

  }
  fbLogin() {
    let self = this;
    this.config.showLoading();
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res) => {
        console.log('Logged into Facebook!');
        // console.log(res);
        let params = new Array();
        //Getting name and gender properties
        this.fb.api("/me?fields=id,name,email", params)
          .then(function (user) {
            console.log(user);
            console.log(self.userType);
            //now we have the users info, let's save it in the NativeStorage
            let fbloginData = {
              type: self.userType,
              social_media_id: user.id,
              social_media_type: "Facebook"
            }
            if ('email' in user) {
              fbloginData['email'] = user.email;
            }
            if ('name' in user) {
              fbloginData['name'] = user.name;
            }

             fbloginData["device_token"]= self.device_token;
             fbloginData["device_type"]= self.device.platform;
            self.config.printLog('inside fbloginData', fbloginData);
            self.userService.socialmediaLogin(fbloginData).then((reaponse) => {
              self.config.printLog('inside userService social', reaponse);
              self.config.hideloading();
              self.navCtrl.setRoot(TabsPage);
            }).catch(error => {
              self.config.hideloading();
            });

          })

      })
      .catch((e) => {
        console.log('Error logging into Facebook', e);
        self.config.hideloading();
      });
  }
  previous() {
    this.navCtrl.push(SignUpPage,{"userType":this.userType});
  }
  forgotPwd() {
    this.navCtrl.push(ForgotPasswordPage,{"type":this.userType});
  }
  googleLogin() {
    let self = this;
    this.config.showLoading();
    this.googlePlus.login({
      'webClientId':'',
      'scopes': 'https://www.googleapis.com/auth/plus.login', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'offline': true
    })
      .then((res) => {
        console.log(res);
        let googleloginData = {
          type: this.userType,
          social_media_id: res.userId,
          social_media_type: "Googleplus"
        }
        if ('email' in res) {
          googleloginData['email'] = res.email;
        }
        if ('name' in res) {
          googleloginData['name'] = res.displayName;
        }
         googleloginData["device_token"]= self.device_token;
        googleloginData["device_type"]=self.device.platform;
        this.config.printLog('inside googleloginData', googleloginData);
        self.userService.socialmediaLogin(googleloginData).then((reaponse) => {
            self.config.printLog('inside userService social', reaponse);
            self.config.hideloading();
            self.navCtrl.setRoot(TabsPage);
          }).catch(error => {
            self.config.hideloading();
          });


      })
      .catch((err) => {
        this.config.hideloading();
        console.error(err);
      });
  }
}
