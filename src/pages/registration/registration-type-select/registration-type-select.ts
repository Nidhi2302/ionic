import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from "../sign-up/sign-up";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { LoginPage } from "../../login/login/login";

/**
 * Generated class for the RegistrationTypeSelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registration-type-select',
  templateUrl: 'registration-type-select.html',
})
export class RegistrationTypeSelectPage {
type="signup";
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider) {
    this.type=this.navParams.get('type');
    //console.log(this.type);
  }

  ionViewDidLoad() {
    this.config.printLog('ionViewDidLoad RegistrationTypeSelectPage','');
  }
  signUp(userType: any) {
    this.navCtrl.push(SignUpPage,{userType:userType});
  }
  goToLogin(userType: any) {
    this.navCtrl.push(LoginPage, { "type": userType });
  }
}
