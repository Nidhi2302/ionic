import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegistrationTypeSelectPage } from "../registration/registration-type-select/registration-type-select";
import { ConfigServiceProvider } from "../../providers/config-service/config-service";
import { SplashVideoPage } from "../splash-video/splash-video";


/**
 * Generated class for the OnBoardingSliderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-on-boarding-slider',
  templateUrl: 'on-boarding-slider.html',
})
export class OnBoardingSliderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public config: ConfigServiceProvider) {
  }

  ionViewDidLoad() {
    this.config.printLog('ionViewDidLoad OnBoardingSliderPage', this.config.getLocalStore("LoggedUser"));
  }

  goToHome(type) {
       this.navCtrl.push(RegistrationTypeSelectPage,{"type":type});
       //this.navCtrl.push(SplashVideoPage);
  }
}
