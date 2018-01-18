import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
 userType
  public forgotPwdForm: FormGroup;
  constructor(public navCtrl: NavController,
  public navParams: NavParams,
   public userService: UserServiceProvider,
   public config:ConfigServiceProvider) {
    this.userType = this.navParams.get("type");
    this.forgotPwdForm = new FormGroup({
      email: new FormControl('', [
        Validators.required
      ])
    })
    this.config.printLog('inside forgot password','');
  }

  ionViewDidLoad() {
    this.config.printLog('ionViewDidLoad forgot password','');
  }
  submit(data, isValid) {
    if (isValid) {
      //call otp api
       this.config.printLog('inside otp next', data);
      this.config.showLoading();
       this.userService.forgotPwd({ "email": data.email }).then((response) => {
      this.config.printLog('inside userService.getOtp', response);
      this.config.showToast(response);
      this.config.hideloading();
       this.navCtrl.pop();
    }).catch(error =>{
       this.config.hideloading();
    });
    }

  }
  previous(){
    this.navCtrl.pop();
  }

}
