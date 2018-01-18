import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { OtpVerifyPage } from "../otp-verify/otp-verify";
import { ValidationService } from "../../../services/validation.service";
/**
 * Generated class for the PhoneNumberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-phone-number',
  templateUrl: 'phone-number.html',
})
export class PhoneNumberPage {
  registerData
  userType;
  public mask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public phoneNumberForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public config: ConfigServiceProvider) {

    this.registerData = this.navParams.get("registerData");
    this.userType = this.registerData.type;
    this.phoneNumberForm = new FormGroup({
      phoneNumber: new FormControl('', Validators.compose([Validators.required,Validators.pattern(".*\\S.*")]))
    })
    this.config.printLog('inside otp', this.registerData);
  }
  onKeyPressed(char: any) {
     //console.log("pressed code",char.keyCode);
    //console.log("pressed key length",char.length);
    if(char.keyCode==8 || char.keyCode==46 ){
      let pressedKey=char.target.value;
      let str2 =pressedKey.substr(pressedKey.length-1,pressedKey.length);
      let str=pressedKey.substr(0,pressedKey.length);
      //console.log(str);
      if(str2=="-"){
        console.log(str2);
        let str3=str.substr(0,str.length-2);
        this.phoneNumberForm.get("phoneNumber").setValue(str3);
      }else{
        console.log(str);
        this.phoneNumberForm.get("phoneNumber").setValue(str);
      }
    
      
    }else{
      console.log("pressed key length",char.target.value.length);
      if(char.target.value.length==3 || char.target.value.length==7){
        this.phoneNumberForm.get("phoneNumber").setValue(char.target.value+"-");
      }
    }
    
    
    // console.log("pressed key after -",char);
     //console.log("pressed from this.phoneNumberForm" ,this.phoneNumberForm.get("phoneNumber").value);
  }
  ionViewDidLoad() {
    this.config.printLog('ionViewDidLoad OtpPage', '');
  }
  next(data, isValid) {
    if (isValid) {
      //call otp api
      //ConfigServiceProvider.printLog('inside otp next', data);
      data.phoneNumber= data.phoneNumber.replace(/-/g,"");
      this.config.showLoading();
      console.log("phoneNum",data.phoneNumber);
      this.userService.getOtp({ "phonenumber": data.phoneNumber }).then((response) => {
        this.config.printLog('inside userService.getOtp', response);
        let dataWithOTP = this.registerData;
        dataWithOTP['otp'] = response['otp'];
        dataWithOTP['phonenumber'] = data.phoneNumber;
        this.config.hideloading();
        this.navCtrl.push(OtpVerifyPage, { "registerData": dataWithOTP });
      }).catch(error => {
        this.config.hideloading();
      });
    }

  }
  previous() {
    this.navCtrl.pop();
  }

}
