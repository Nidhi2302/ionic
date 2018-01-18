import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { PhoneNumberPage } from "../phone-number/phone-number";
import { LoginPage } from "../../login/login/login";
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { ValidationService } from "../../../services/validation.service";
import { Device } from '@ionic-native/device';
import { PushObject, Push, PushOptions } from '@ionic-native/push';
/**
 * Generated class for the SignUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  userType
  public userSignupForm: FormGroup;
  public submitted = false;
  device_token=null
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
    private fb: Facebook,
    private device: Device,
    private googlePlus: GooglePlus,
    protected formbuilder: FormBuilder,   private push: Push ) {
    this.userType = this.navParams.get('userType');
    this.config.printLog("User Type:", this.userType);

    this.userSignupForm = this.formbuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(".*\\S.*")])],
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(".*\\S.*")])]
    });
    this.config.getLocalStore("RegistrationId").then((RegistrationId) => {
      this.device_token = RegistrationId;
    })
  }

  ionViewDidEnter() {
    this.config.printLog('ionViewDidLoad SignUpPage', '');
  }
  ionViewDidLoad() {
    const pushObject: PushObject = this.push.init(this.options);
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
      this.device_token = registration.registrationId;
      this.config.setLocalStore("RegistrationId", registration.registrationId);
    });
    
  }
  userRegister(data, isValid) {
    this.config.showLoading();
    this.submitted = true;
    if (isValid) {
      let requestData = {
        name: data.name,
        email: data.email,
        password: data.password,
        type: this.userType,
        device_token: this.device_token,
        device_type: this.device.platform
      }
      this.userService.isEmailExists({ email: data.email }).then((reaponse) => {
        this.config.printLog('inside userService', reaponse);
        this.config.hideloading();
        this.navCtrl.push(PhoneNumberPage, { "registerData": requestData });
      }).catch(error => {
        this.config.hideloading();
      });

    }
  }
  goToLogin() {
    this.navCtrl.push(LoginPage, { "type": this.userType });
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

            fbloginData["device_token"] = self.device_token;
            fbloginData["device_type"] =  self.device.platform;
            self.config.printLog('inside fbloginData', fbloginData);
            self.userService.isEmailExists({ email: user.email }).then((reaponse) => {
              self.config.printLog('inside userService', reaponse);
              self.config.hideloading();
              self.navCtrl.push(PhoneNumberPage, { "registerData": fbloginData });
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
  googleLogin() {
    this.config.showLoading();
    this.googlePlus.login({
      'webClientId': '',
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
        googleloginData["device_token"] = this.device_token;
        googleloginData["device_type"] = this.device.platform;
        this.config.printLog('inside googleloginData', googleloginData);
        this.userService.isEmailExists({ email: res.email }).then((reaponse) => {
          this.config.printLog('inside userService', reaponse);
          this.config.hideloading();
          this.navCtrl.push(PhoneNumberPage, { "registerData": googleloginData });
        }).catch(error => {
          this.config.hideloading();
        });

      })
      .catch((err) => {
        this.config.hideloading();
        console.error(err);
      });
  }
}
