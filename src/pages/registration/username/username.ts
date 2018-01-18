import { Component, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Device } from "@ionic-native/device";
import { HomePage } from "../../user/home/home";
import { ProfilePage } from "../../vendor/profile/profile";
import { CreateCouponPage } from "../../vendor/create-coupon/create-coupon";
import { VendorHomePage } from "../../vendor-home/vendor-home";
import { StripePage } from "../../vendor/stripe/stripe";
import { LoginPage } from "../../login/login/login";
import { TabsPage } from "../../user/tabs/tabs";


/**
 * Generated class for the UsernamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-username',
  templateUrl: 'username.html',
})
export class UsernamePage {
  registerData
  userType
  msg
  isAvl=1;
  public userNameForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public config: ConfigServiceProvider,
    private device: Device) {

    this.registerData = this.navParams.get("registerData");
    this.userType = this.registerData.type;
    this.userNameForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
      Validators.pattern("^[a-zA-Z0-9-_]{6,30}$")
      ])
    })
    this.config.printLog('inside otp', this.registerData);
  }
      @HostListener('focusout', ['$event.target'])
    onFocusout(target) {
      console.log("Focus out called");
      target.type = 'text';
    }
  isAvalUser(ev) {
    this.config.showLoading();
    if (ev.target.value.length >=6 ) {
      console.log("ev.target.value",ev.target.value);
      if(!this.userNameForm.valid){
        this.msg="Sapce and special chars are not allowed except - & _";
        this.isAvl=3;
        this.config.hideloading();
      }else{
        this.userService.isUsernameExists({ "username": ev.target.value }).then((reaponse) => {
          this.msg=reaponse;
          this.isAvl=2;
          this.config.hideloading();
        }).catch((err)=>{
          //console.log("ev.target.value",err._body.substr(1,err._body.length-1));
           this.msg=err._body.substr(1,err._body.length-2);
          this.isAvl=3;
          this.config.hideloading();
        })
      }
      
    }else{
      this.isAvl=1;
      this.config.hideloading();
    }
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }
  next(data, isValid) {
    if (isValid) {
      //call otp api
      //ConfigServiceProvider.printLog('inside otp next', data);
      this.config.showLoading();
      this.userService.isUsernameExists({ "username": data.userName }).then((reaponse) => {
        this.config.printLog('inside userService.isUsernameExists', reaponse);
        this.userService.isEmailExists({ "email": this.registerData.email }).then((response) => {
          this.registerData['username'] = data.userName;
          this.registerData['device_id'] = this.device.uuid;
          this.userService.registration(this.registerData).then((response1) => {
            this.config.printLog('inside userService.registration', response1);
            this.config.hideloading();
            if (this.registerData.type == "user") {
              this.navCtrl.push(TabsPage);
              // this.navCtrl.push(HomePage);
            } else {

              if (response1['verified'] == true) {
                if (response1['isSubscribe']) {
                  this.navCtrl.push(VendorHomePage);
                }
                else {
                  this.navCtrl.push(StripePage);
                }

              }
              else {
                console.log(response1['message']);
                this.config.showToast(response1['message']);
                this.navCtrl.push(LoginPage, { "type": "vendor" });
              }
            }


          }).catch(error => {
            this.config.hideloading();
          });
        }).catch((error) => {
          this.config.hideloading();
        })

      }).catch(error => {
        this.config.hideloading();
      });
    }

  }
  previous() {
    this.navCtrl.pop();
  }

}
