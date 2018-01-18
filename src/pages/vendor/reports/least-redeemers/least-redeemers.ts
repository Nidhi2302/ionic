import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StatisticsPage } from "../../statistics/statistics";
import { VendorProvider } from "../../../../providers/vendor/vendor";
import { ConfigServiceProvider } from "../../../../providers/config-service/config-service";
import { User } from "../../../../models/user";

/**
 * Generated class for the LeastRedeemersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-least-redeemers',
  templateUrl: 'least-redeemers.html',
})
export class LeastRedeemersPage {

  loggedinUser = {};
  leastReedeemer =[];
  businessLogo= "assets/business-logo/user-default.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,public menu:MenuController, public vendor: VendorProvider ,public config:ConfigServiceProvider) {
   let self = this;
    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig
         // self.getActiveRedeemer(self.loggedinUser["secretToken"]);
         self.getleastRedeemer();
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err)=>{
      this.config.printLog("",err);
    });
    this.config.getLocalStore("profilePic").then((value) => {
      if(value){
        this.businessLogo=value;
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeastRedeemersPage');
  }
  menuclick(){
    let self = this;
    self.navCtrl.setRoot(StatisticsPage);
  }
  getleastRedeemer(){
    console.log("hello");
     let self = this;
    let page =1;
    self.config.showLoading();
    self.vendor.getLeastRedeemers(self.loggedinUser["secretToken"],page).then((response) => {
      if(response){
        self.leastReedeemer =response['data'];
      }
      self.config.hideloading();
      console.log(self.leastReedeemer);
    }).catch((error)=>{
      self.config.hideloading();
    });
  }

}
