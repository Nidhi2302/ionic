import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsernamePage } from "../username/username";

/**
 * Generated class for the OtpVerifyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-otp-verify',
  templateUrl: 'otp-verify.html',
})
export class OtpVerifyPage {
  registerData
  userType
  compareOTP
  public otpVerifyForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public toastCtrl: ToastController,
    public config: ConfigServiceProvider) 
    {
    this.registerData = this.navParams.get("registerData");
    this.userType = this.registerData.type;
    this.compareOTP = this.registerData.otp;
    this.otpVerifyForm = new FormGroup({
      fDigit: new FormControl('', [
        Validators.required,
        Validators.pattern('^([0-9]{1})$')
      ]),
      sDigit: new FormControl('', [
        Validators.required,
        Validators.pattern('^([0-9]{1})$')
      ]),
      tDigit: new FormControl('', [
        Validators.required,
        Validators.pattern('^([0-9]{1})$')
      ]),
      foDigit: new FormControl('', [
        Validators.required,
        Validators.pattern('^([0-9]{1})$')
      ]),
    })
    this.config.printLog('inside otp', this.registerData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpVerifyPage');
  }
  
  next(data, isValid) {
    if (isValid) {
      //call otp api
     this.config.showLoading();
      let currentOTP = data.fDigit + data.sDigit + data.tDigit + data.foDigit;
        this.config.printLog('inside otp next currentOTP', currentOTP);
      if (currentOTP === this.compareOTP) {
         this.config.hideloading();
        this.navCtrl.push(UsernamePage,{"registerData":this.registerData});
      }
      else {
        this.otpVerifyForm.reset();
         this.config.hideloading();
         this.config.showToast("OTP is invalid");
      }
    }

  }
  previous() {
    this.navCtrl.pop();
  }
   autoTab(ev,field){
    
    if (ev.srcElement.form.elements[field]) {
      console.log(ev.srcElement.form.elements[field]);
               ev.srcElement.form.elements[field].focus();
            }
            else{
               
                console.log('close keyboard');
            }
  }
  resendOTP() {
     this.config.showLoading();
    this.userService.getOtp({ "phonenumber": this.registerData.phonenumber }).then((response) => {
      this.config.printLog('inside userService.getOtp', response);
      this.compareOTP = response['otp'];
      this.registerData['otp']=response['otp'];
       this.otpVerifyForm.reset();
        this.config.showToast(response['message']);
       this.config.hideloading();
    }).catch(error => {
       this.config.hideloading();
    });
  }
  runTimeChange(){

  }
}

