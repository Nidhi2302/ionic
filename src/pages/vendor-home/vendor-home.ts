import { Component } from '@angular/core';
import { IonicPage, NavController,MenuController, NavParams } from 'ionic-angular';
import { CreateCouponPage } from "../vendor/create-coupon/create-coupon";
import { User } from "../../models/user";
import { ConfigServiceProvider } from "../../providers/config-service/config-service";
import { LoginPage } from "../login/login/login";
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { HomePage } from "../user/home/home";


/**
 * Generated class for the VendorHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vendor-home',
  templateUrl: 'vendor-home.html',
})
export class VendorHomePage {

loggedinUser
pages: Array<{title: string, component: any}>;
  constructor(public navCtrl: NavController,public menu:MenuController, public navParams: NavParams,public config: ConfigServiceProvider,public userService: UserServiceProvider) {
    let self = this;
    self.menu.enable(true);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorHomePage');
  }
gotoCoupon(){
  this.navCtrl.push(CreateCouponPage);
}

}
